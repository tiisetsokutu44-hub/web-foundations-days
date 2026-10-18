# SnapShare Scaling Plan

## 1. Assumptions and estimates

### Assumptions
- SnapShare has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads 1 photo per day and views 50 feed pages per day.
- Each original photo averages 2 MB, and each photo has one 50 KB thumbnail.
- A day has 86,400 seconds and a year has 365 days.
- Storage estimates use decimal units (1 TB = 1,000 GB). They assume every uploaded photo is retained for the full year and exclude database metadata, backups, replication, retries, and future user growth.
- Average request rates are spread across 24 hours. Peak feed traffic is estimated at 5 times the average rate.

### Daily active users
10,000,000 registered users × 10% = **1,000,000 daily active users (DAU)**.

### Uploads per second
- Uploads per day: 1,000,000 DAU × 1 photo = **1,000,000 uploads/day**.
- Average uploads per second: 1,000,000 ÷ 86,400 = **about 11.6 uploads/second**.

### Feed views per second
- Feed page views per day: 1,000,000 DAU × 50 pages = **50,000,000 feed views/day**.
- Average feed views per second: 50,000,000 ÷ 86,400 = **about 579 feed views/second**.
- Estimated peak feed views per second: 579 × 5 = **about 2,894 feed views/second**.

### Photo storage per year
- Original photos per day: 1,000,000 × 2 MB = **2,000,000 MB/day**, or about **2 TB/day**.
- Original photo storage per year: 2 TB × 365 = **730 TB/year**.
- Thumbnails per day: 1,000,000 × 50 KB = **50 GB/day**.
- Thumbnail storage per year: 50 GB × 365 = **18.25 TB/year**.
- Total original-photo and thumbnail storage: **about 748.25 TB/year**, before backups, replicas, metadata, and other overhead.

These estimates are a baseline, not a capacity guarantee. Real capacity planning should also allow for traffic bursts, retries, uneven activity, and growth.

## 2. Read-heavy or write-heavy?

SnapShare is **read-heavy** based on the supplied activity assumptions: it receives about 50 million feed-page views per day compared with 1 million photo uploads per day. Feed traffic averages about 579 page views per second and may reach about 2,894 per second at the estimated peak. The design should therefore scale read traffic efficiently with caching, a CDN, and a database read replica, while using a queue to move thumbnail processing out of the upload request.

## 3. Where photo files should be stored

Photo files should go in **object storage**, not directly inside the relational database. Original photos and thumbnails are large binary files, and keeping them in the database would increase database size, backup and restore times, and storage costs while competing with metadata queries. The database should store metadata such as the photo ID, owner/user ID, object-storage key, upload time, and visibility; the actual image files live in object storage and are delivered through a CDN.

## 4. Text architecture diagram

```text
                         +----------------------+
                         |        Users         |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |         CDN          |
                         | Cached image delivery|
                         +----+------------+----+
                              |            ^
                    API/feed  |            | photos/thumbnails
                    requests  v            |
                         +----------------------+
                         |    Load Balancer     |
                         +----------+-----------+
                                    |
                    +---------------+---------------+
                    |               |               |
                    v               v               v
             +-------------+ +-------------+ +-------------+
             | App Server  | | App Server  | | App Server  |
             | API/feed    | | API/upload  | | API/feed    |
             +------+------+ +------+------+ +------+------+
                    |               |               |
                    +---------------+---------------+
                                    |
                 +------------------+-------------------+
                 |                  |                   |
                 v                  v                   v
          +-------------+    +-------------+    +---------------+
          |    Cache    |    |  Database   |    | Object Storage|
          | hot feeds / |    | primary DB  |    | originals and |
          | metadata    |    +------+------+    | thumbnails   |
          +-------------+           |           +-------+-------+
                                    |                   ^
                                    v                   |
                             +--------------+            |
                             | Read Replica |            |
                             | read queries |            |
                             +--------------+            |
                                                        |
 Photo upload event                                     |
        |                                               |
        v                                               |
 +--------------+      +----------------+               |
 |    Queue     |----->| Thumbnail Worker|--------------+
 | thumbnail job|      | resize/create   |
 +--------------+      +----------------+
```

The diagram is a logical overview: the CDN serves cached images, while app servers handle API requests. Depending on the implementation, clients may upload directly to object storage using a short-lived signed URL; the app server still authenticates the user and records metadata.

## 5. What each component solves

- **CDN:** Delivers frequently requested photos and thumbnails from locations closer to users, reducing latency and origin traffic.
- **Load balancer:** Distributes incoming API traffic across healthy app servers so that one server does not become a bottleneck.
- **App servers:** Apply authentication, permissions, upload coordination, feed logic, and other application rules.
- **Cache:** Keeps frequently requested feed data or metadata in fast memory to reduce repeated database work.
- **Primary database:** Stores durable structured data such as users, follows, photo metadata, and feed-related records.
- **Database read replica:** Serves eligible read queries to reduce load on the primary database, while accepting that replication can introduce a small delay.
- **Object storage:** Stores large original photo files and generated thumbnails durably and scales independently of the database.
- **Queue:** Buffers thumbnail jobs so upload requests do not have to wait for image processing and temporary bursts can be absorbed.
- **Thumbnail worker:** Pulls jobs from the queue, creates appropriately sized thumbnails, and saves them to object storage.
- **Users/clients:** Upload photos and request feeds through the application rather than connecting directly to the database.

## 6. Photo upload flow

1. The user selects a photo in the app and submits an upload request.
2. The load balancer routes the request to a healthy app server.
3. The app server authenticates the user, checks upload permissions and limits, and creates a photo record or upload intent in the primary database.
4. The app server provides a short-lived signed upload URL, or securely coordinates the upload, so the client can send the original photo to object storage without routing the entire file through the database.
5. The client uploads the original photo to object storage.
6. After the upload succeeds, the app server confirms the object exists and updates the photo record's status and storage key.
7. The app server publishes a thumbnail-generation job to the queue with the photo ID and object-storage key.
8. A thumbnail worker consumes the job, reads the original image from object storage, validates and resizes it, and creates the 50 KB thumbnail (or a suitable target size/format).
9. The worker saves the thumbnail to object storage and updates the photo metadata/status in the database.
10. When a user views the feed, the app gets feed metadata from the cache or database/read replica and returns image URLs; the CDN serves the original or thumbnail as appropriate.

The upload can be marked as “processing” until the thumbnail is ready, so the feed can show a placeholder or the original image temporarily. The queue and worker should support retries and idempotency so a repeated job does not create inconsistent records.

## 7. Trade-offs

1. **Cache speed vs. freshness:** Caching makes feed reads faster and reduces database load, but cached feed data can be stale; the system needs expiry rules or invalidation when users upload photos or change who they follow.
2. **Read replica scale vs. consistency:** A read replica takes pressure off the primary database, but replication lag means a newly uploaded photo or updated metadata may not appear immediately in every read.
3. **Asynchronous thumbnails vs. immediate availability:** A queue keeps uploads responsive and absorbs bursts, but thumbnails are not available instantly and workers/queues need monitoring, retries, and dead-letter handling.
4. **Object storage + CDN vs. operational complexity:** This arrangement scales photo delivery and reduces database load, but requires storage-key management, access controls, CDN cache rules, and lifecycle policies.
5. **Direct-to-object-storage uploads vs. simpler server-mediated uploads:** Signed URLs reduce app-server bandwidth, but they must be short-lived and scoped correctly; server-mediated uploads are simpler to reason about but can make app servers a bandwidth bottleneck.

## 8. Capacity considerations

- Monitor upload rate, feed latency, cache hit rate, database query latency, replica lag, queue depth, thumbnail processing time, and object-storage/CDN costs.
- Add app-server instances horizontally as request volume grows.
- Set retention, backup, access-control, and lifecycle policies before real user data accumulates.
- Recalculate these estimates as actual usage, average image size, and user growth become measurable.

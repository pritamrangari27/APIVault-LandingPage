## MySQL Database Interaction

Run the following command to interact with MySQL:

```bash
docker exec -it apisecurity-mysql mysql -u apiuser -papipass123 apisecurity
```

## Database Tables

### `users` Table

```text
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| id         | bigint       | NO   | PRI | NULL    | auto_increment |
| active     | bit(1)       | NO   |     | NULL    |                |
| created_at | datetime(6)  | NO   |     | NULL    |                |
| email      | varchar(100) | NO   | UNI | NULL    |                |
| name       | varchar(50)  | NO   |     | NULL    |                |
| password   | varchar(255) | NO   |     | NULL    |                |
| updated_at | datetime(6)  | NO   |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+
```

### `scan_results` Table

```text
+----------------+---------------------------------------------------+------+-----+---------+----------------+
| Field          | Type                                              | Null | Key | Default | Extra          |
+----------------+---------------------------------------------------+------+-----+---------+----------------+
| id             | bigint                                            | NO   | PRI | NULL    | auto_increment |
| created_at     | datetime(6)                                       | NO   |     | NULL    |                |
| critical_count | int                                               | YES  |     | NULL    |                |
| file_path      | text                                              | YES  |     | NULL    |                |
| high_count     | int                                               | YES  |     | NULL    |                |
| low_count      | int                                               | YES  |     | NULL    |                |
| medium_count   | int                                               | YES  |     | NULL    |                |
| security_score | int                                               | YES  |     | NULL    |                |
| spec_title     | varchar(255)                                      | NO   |     | NULL    |                |
| spec_version   | varchar(255)                                      | NO   |     | NULL    |                |
| status         | enum('COMPLETED','FAILED','PENDING','PROCESSING') | NO   |     | NULL    |                |
| total_findings | int                                               | YES  |     | NULL    |                |
| updated_at     | datetime(6)                                       | NO   |     | NULL    |                |
| user_id        | bigint                                            | NO   | MUL | NULL    |                |
+----------------+---------------------------------------------------+------+-----+---------+----------------+
```

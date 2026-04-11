# Java / Spring Stack Adapter

Stack-specific pattern detection hints for Java codebases using Spring Boot, Spring MVC, and the broader Spring ecosystem. These hints help Unearth skills locate framework-specific structures faster and produce more accurate results.

## Stack Fingerprint

Confirm this adapter applies by checking for at least two of these signals:

| Signal | File / Pattern |
|---|---|
| Build tool | `pom.xml` (Maven) or `build.gradle` / `build.gradle.kts` (Gradle) |
| Spring Boot | `spring-boot-starter-*` dependency, `@SpringBootApplication` annotation |
| Spring MVC | `spring-boot-starter-web`, `@RestController`, `@Controller` |
| Java source | `src/main/java/**/*.java` directory structure |
| Application config | `application.properties`, `application.yml`, or `application-{profile}.yml` |

---

## Skill Hooks

### 00-recon

**Project detection:**
- Maven: parse `pom.xml` for `<modules>` (multi-module), `<parent>` (Spring Boot parent BOM version), `<packaging>` (jar, war, pom)
- Gradle: parse `settings.gradle` for `include` (multi-module), `build.gradle` for `plugins { id 'org.springframework.boot' }`
- Java version: `<java.version>` in pom.xml or `sourceCompatibility` in build.gradle
- Spring Boot version: `spring-boot-starter-parent` version or `spring-boot-dependencies` BOM version

**Framework detection signals:**
- `spring-boot-starter-web` -- REST API / MVC
- `spring-boot-starter-webflux` -- reactive stack (WebFlux)
- `spring-boot-starter-data-jpa` -- JPA/Hibernate persistence
- `spring-boot-starter-data-mongodb` -- MongoDB
- `spring-boot-starter-data-redis` -- Redis
- `spring-boot-starter-security` -- Spring Security
- `spring-boot-starter-actuator` -- health and metrics endpoints
- `spring-cloud-starter-*` -- Spring Cloud (config, discovery, gateway)
- `spring-kafka` or `spring-cloud-stream` -- event streaming

**Deployment signals:**
- `Dockerfile` with `java -jar` or `ENTRYPOINT` -- container deployment
- `docker-compose.yml` -- local multi-service orchestration
- `Jenkinsfile`, `.github/workflows/*.yml` -- CI/CD
- `kubernetes/*.yml` or `helm/` -- Kubernetes deployment
- `application-{profile}.yml` files -- environment-based configuration

---

### 01-entry-points

**HTTP endpoints:**
- Look for `@RestController` and `@Controller` classes
- Map `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` annotations to routes
- Check class-level `@RequestMapping("/api/...")` for path prefix
- Look for `@PathVariable`, `@RequestParam`, `@RequestBody` for parameter types
- WebFlux: look for `RouterFunction<ServerResponse>` in functional endpoint definitions

**Event and message handlers:**
- `@KafkaListener` -- Kafka consumer
- `@RabbitListener` -- RabbitMQ consumer
- `@JmsListener` -- JMS consumer
- `@StreamListener` or Spring Cloud Stream `@Bean Consumer<Message<?>>` -- event stream consumer
- `@SqsListener` or `@SqsMessageHandler` -- AWS SQS
- `@EventListener` and `@TransactionalEventListener` -- internal Spring events

**Scheduled jobs:**
- `@Scheduled(fixedRate=...)` or `@Scheduled(cron="...")` -- Spring Scheduler
- Quartz `@DisallowConcurrentExecution` or `Job` implementations
- Spring Batch `@EnableBatchProcessing` with `Job` and `Step` beans

**WebSocket endpoints:**
- `@ServerEndpoint` (JSR 356) or Spring `WebSocketHandler` implementations
- STOMP over WebSocket: `@MessageMapping` with `@EnableWebSocketMessageBroker`

**Startup hooks:**
- `CommandLineRunner` or `ApplicationRunner` beans
- `@PostConstruct` methods
- `@EventListener(ApplicationReadyEvent.class)`
- `InitializingBean.afterPropertiesSet()`

---

### 02-actors-and-boundaries

**Authentication patterns:**
- `WebSecurityConfigurerAdapter` or `SecurityFilterChain` bean -- security configuration
- `@PreAuthorize("hasRole('...')")`, `@Secured`, `@RolesAllowed` -- method-level auth
- `.authorizeHttpRequests()` chain in security config -- URL-level auth
- `JwtDecoder` or `JwtAuthenticationConverter` beans -- JWT (OAuth2 resource server)
- `@WithMockUser` in tests -- reveals expected roles
- `.permitAll()` in security config -- public endpoints
- `@AuthenticationPrincipal` parameter -- authenticated user injection

**API boundary detection:**
- Swagger/OpenAPI: `@OpenAPIDefinition`, `springdoc-openapi-*` dependency, `/v3/api-docs` endpoint
- API versioning: URL path (`/api/v1/`), header (`Accept-Version`), or media type versioning
- CORS: `@CrossOrigin` or `CorsConfiguration` beans

---

### 03-external-systems

**Database connections:**
- `spring.datasource.*` in application.yml -- JDBC/JPA database
- `spring.data.mongodb.*` -- MongoDB
- `spring.redis.*` or `spring.data.redis.*` -- Redis
- `spring.elasticsearch.*` -- Elasticsearch
- `spring.cassandra.*` -- Cassandra
- `spring.r2dbc.*` -- reactive database (R2DBC)

**Message broker connections:**
- `spring.kafka.bootstrap-servers` -- Kafka
- `spring.rabbitmq.*` -- RabbitMQ
- `spring.activemq.*` -- ActiveMQ

**External HTTP clients:**
- `RestTemplate` or `WebClient` beans with base URLs
- `@FeignClient(name="...", url="...")` -- Spring Cloud OpenFeign
- `Retrofit` interfaces
- `OkHttpClient` or `HttpClient` with configured URLs

**Cloud service integrations:**
- AWS: `aws-sdk-*` dependencies, `AmazonS3Client`, `AmazonSQSClient`
- GCP: `spring-cloud-gcp-*` dependencies
- Azure: `azure-spring-boot-*` dependencies
- External SaaS: look for API key configuration in application.yml

---

### 04-containers

**Container identification:**
- Each Spring Boot application with its own `@SpringBootApplication` class is a container
- Maven modules with `spring-boot-maven-plugin` are independently deployable
- Gradle subprojects with `bootJar` task are independently deployable
- Shared libraries: modules without `@SpringBootApplication` (often named `*-common`, `*-core`, `*-shared`)

**Inter-container communication:**
- Feign clients (`@FeignClient`) -- synchronous HTTP between services
- `RestTemplate` / `WebClient` calls with service names (Spring Cloud Discovery)
- Kafka/RabbitMQ topics shared across services
- Spring Cloud Gateway routes -- API gateway to downstream services
- gRPC: `grpc-spring-boot-starter` with `@GrpcService` / `@GrpcClient`

**Infrastructure patterns:**
- Spring Cloud Config Server -- centralized configuration
- Eureka / Consul -- service discovery
- Spring Cloud Gateway or Zuul -- API gateway
- Spring Cloud Circuit Breaker (Resilience4j) -- fault tolerance
- Spring Cloud Sleuth / Micrometer Tracing -- distributed tracing

---

### 05-components

**Layer detection patterns:**
- Controllers: `@RestController`, `@Controller` -- presentation layer
- Services: `@Service` -- business logic layer
- Repositories: `@Repository`, `JpaRepository`, `CrudRepository`, `MongoRepository` -- data access layer
- Configuration: `@Configuration`, `@ConfigurationProperties` -- infrastructure
- Domain entities: `@Entity` (JPA), `@Document` (MongoDB), `@Table` (JPA) -- domain model

**Business component boundaries:**
- Package structure: `com.company.module.{controller,service,repository}` -- package-per-layer
- Or: `com.company.{feature}.{controller,service,repository}` -- package-per-feature
- Domain-Driven Design: look for `domain/`, `application/`, `infrastructure/`, `port/`, `adapter/` packages

**God class signals:**
- Service classes > 500 lines
- Controllers with > 15 handler methods
- Repository interfaces with > 20 custom query methods
- Utility classes with mixed responsibilities

**Test detection:**
- `src/test/java/` directory structure
- `@SpringBootTest` -- integration tests
- `@WebMvcTest` -- controller layer tests
- `@DataJpaTest` -- repository layer tests
- `@MockBean` usage -- reveals dependency structure
- Mockito `@Mock` and `@InjectMocks` -- unit tests

---

### 06-capabilities

**Capability signals in Spring projects:**
- Feature packages or modules often map directly to capabilities
- `@RestController` classes grouped by domain area
- Swagger `@Tag` annotations describe capability areas
- Spring Boot Actuator custom endpoints may reveal operational capabilities

---

### 07-data-model

**Entity detection:**
- JPA: `@Entity`, `@Table`, `@Column`, `@Id`, `@GeneratedValue`
- Relationships: `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@OneToOne`
- MongoDB: `@Document`, `@Field`, `@DBRef`
- Flyway (`db/migration/V*.sql`) or Liquibase (`db/changelog/`) -- schema evolution
- DTOs: classes in `dto/`, `request/`, `response/` packages
- MapStruct or ModelMapper interfaces -- entity-DTO mapping

**Data store identification:**
- JPA entity scan packages in `@EntityScan`
- MongoDB collection names in `@Document(collection="...")`
- Redis key patterns in `RedisTemplate` usage

---

### 08-patterns

**Common Spring patterns to detect:**
- Repository pattern: JPA/Mongo repositories extending Spring Data interfaces
- CQRS: separate read/write models, `@CommandHandler` / `@QueryHandler` (Axon)
- Event sourcing: Axon Framework `@Aggregate`, `@EventSourcingHandler`
- Saga: `@Saga` (Axon) or choreography via event listeners
- Specification pattern: `Specification<T>` implementations for dynamic queries
- Strategy pattern: multiple `@Component` implementations of a shared interface
- Template method: abstract classes with `@Override` hooks
- Observer: `ApplicationEventPublisher` and `@EventListener`

**Anti-pattern signals:**
- `@Transactional` on controller methods (should be on service layer)
- Business logic in `@Repository` custom implementations
- Circular `@Autowired` dependencies
- `@ComponentScan` with overly broad base packages
- Thread-unsafe `@Scope("singleton")` beans with mutable state

---

### 09-dependencies

**Package dependency analysis:**
- Parse `pom.xml` `<dependencies>` for direct dependencies and `<dependencyManagement>` for managed versions
- Parse `build.gradle` `dependencies {}` block
- Look for BOM imports managing transitive versions
- Flag deprecated or EOL libraries: check for Spring Boot 2.x (EOL), Java 8/11 if unsupported

**Shared library detection:**
- Maven modules without `spring-boot-maven-plugin` are shared libraries
- Internal dependencies: `<module>` references in parent POM
- `@ConditionalOnClass` / `@AutoConfiguration` in shared starters

---

## Common Java/Spring File Patterns

| Pattern | Location |
|---|---|
| Application entry point | `src/main/java/**/Application.java` or `*Application.java` |
| Controllers | `**/controller/*.java` or `**/web/*.java` |
| Services | `**/service/*.java` or `**/service/impl/*.java` |
| Repositories | `**/repository/*.java` or `**/dao/*.java` |
| Entities | `**/entity/*.java` or `**/domain/*.java` or `**/model/*.java` |
| DTOs | `**/dto/*.java` or `**/request/*.java` or `**/response/*.java` |
| Configuration | `**/config/*.java` or `**/configuration/*.java` |
| Security | `**/security/*.java` |
| Database migrations | `src/main/resources/db/migration/` (Flyway) or `db/changelog/` (Liquibase) |
| Application config | `src/main/resources/application.yml` or `application.properties` |
| Test config | `src/test/resources/application-test.yml` |

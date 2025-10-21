package org.strisys.model.entity.superclass.impl;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import org.strisys.model.entity.superclass.Base;

import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseEntity implements Base {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private Short version = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    public BaseEntity() {
    }

    public BaseEntity(Long id) {
        this.id = id;
    }

    public BaseEntity(Long id, LocalDateTime createdAt, LocalDateTime modifiedAt) {
        this.id = id;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Short getVersion() {
        return version;
    }

    public void setVersion(Short version) {
        this.version = version;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    @Override
    public String toString() {
        return "{\"BaseEntity\":{"
                + "\"id\":\"" + id + "\""
                + ",\"version\":\"" + version + "\""
                + ",\"createdAt\":" + createdAt
                + ", \"modifiedAt\":" + modifiedAt
                + "}}";
    }

    /**
     * when having issues determining which thread is placing an entity into
     *
     * the persistence context uncomment the following hooks
     */
//    @PreUpdate
//    public void preUpdate() {
//        System.out.println("Entity is being updated: " + this);
//        // Optionally log the stack trace
//        Thread.dumpStack();
//    }
//    @PostLoad
//    public void postLoad() {
//        System.out.println("Entity loaded into persistence context: " + this);
//        Thread.dumpStack();
//    }
}
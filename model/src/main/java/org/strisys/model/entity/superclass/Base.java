package org.strisys.model.entity.superclass;

import java.time.LocalDateTime;

public interface Base {
    Long getId();
    void setId(Long id);

    Short getVersion();
    void setVersion(Short version);

    LocalDateTime getCreatedAt();
    void setCreatedAt(LocalDateTime createdAt);

    LocalDateTime getModifiedAt();
    void setModifiedAt(LocalDateTime modifiedAt);
}

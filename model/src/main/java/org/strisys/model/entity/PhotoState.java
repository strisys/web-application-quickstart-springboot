package org.strisys.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.strisys.model.entity.superclass.impl.BaseEntity;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "photo", indexes = {
  @Index(name = "idx_photo_uuid", columnList = "uuid", unique = true)
})
public class PhotoState extends BaseEntity {
    @Column(name = "uuid", nullable = false, updatable = false, unique = true, length = 36)
    @Size(max = 255, message = "Identifier for photo")
    private String uuid;

    @Column(name = "name", nullable = false, updatable = true, unique = false, length = 255)
    @Size(max = 255, message = "File name must be 255 characters or less")
    @NotNull(message = "File name cannot be null")
    @NotEmpty(message = "File name cannot be empty")
    @Pattern(regexp = "^[^\\\\/:*?\"<>|]+\\.(png|jpe?g|gif)$", message = "File name must end with .png or .jpg")
    private String fileName;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "file", columnDefinition = "BLOB")
    @JsonIgnore
    private byte[] file;

    @Column(name = "content_type", nullable = false, updatable = true, length = 255)
    private String contentType;

    private boolean isNull;

    public static PhotoState createNull() {
        return PhotoState.builder()
                .uuid("null")
                .fileName("null")
                .contentType("null")
                .isNull(true)
                .build();
    }

    public static PhotoState createRandom() {
        return PhotoState.builder()
                .uuid(UUID.randomUUID().toString())
                .fileName(UUID.randomUUID() + ".png")
                .contentType("image/png")
                .isNull(false)
                .build();
    }

    @JsonIgnore
    public PhotoState getCopy() {
        PhotoState copy = PhotoState.builder()
                .uuid(this.uuid)
                .fileName(this.fileName)
                .file(this.file)
                .contentType(this.contentType)
                .isNull(this.isNull)
                .build();

        copy.setId(this.getId());
        copy.setModifiedAt(this.getModifiedAt());

        return copy;
    }
}

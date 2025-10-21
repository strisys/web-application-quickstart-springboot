package org.strisys.model.entity;

import java.util.UUID;
import jakarta.persistence.*;
import org.strisys.model.entity.superclass.impl.BaseEntity;

public class Photo extends BaseEntity {
    private PhotoState state;

    public Photo() {
    }

    private Photo(PhotoState state) {
        this.state = state;
    }

    public String getUuid() {
        if (this.state.getUuid() == null) {
            this.state.setUuid(UUID.randomUUID().toString());
        }

        return this.state.getUuid();
    }

    public void setUuid(String uuid) {
        this.state.setUuid(uuid);
    }

    public String getFileName() {
        return this.state.getFileName();
    }

    public void setFileName(String fileName) {
        this.state.setFileName(fileName);
    }

    public byte[] getFile() {
        return this.state.getFile();
    }

    public void setFile(byte[] file) {
        this.state.setFile(file);
    }

    public String getContentType() {
        return this.state.getContentType();
    }

    public void setContentType(String contentType) {
        this.state.setContentType(contentType);
    }

    public Boolean getIsNull() {
        return this.state.isNull();
    }

    public PhotoState getState() {
        return this.state.getCopy();
    }

    public static Photo getNull() {
        return (new Photo(PhotoState.createNull()));
    }

    public static Photo create(PhotoState state) {
        if (state.getUuid() == null) {
            state.setUuid(UUID.randomUUID().toString());
        }

        return (new Photo(state));
    }
}

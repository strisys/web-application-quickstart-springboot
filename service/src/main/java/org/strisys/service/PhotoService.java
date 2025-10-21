package org.strisys.service;

import java.util.Collection;

import org.springframework.stereotype.Service;
import org.strisys.data.PhotoDataService;
import org.strisys.model.entity.Photo;

@Service
public class PhotoService {
    private final PhotoDataService ds;

    public PhotoService(PhotoDataService ds) {
        this.ds = ds;
    }

    public Collection<Photo> getAll() {
        return ds.findAll();
    }

    public Photo tryGet(String id) {
        return ds.tryGet(id);
    }

    public Photo save(String fileName) {
        return ds.save(fileName, new byte[0], "");
    }

    public Photo save(String fileName, byte[] bytes, String contentType) {
        return ds.save(fileName, bytes, contentType);
    }

    public Photo remove(String id) {
        return ds.remove(id);
    }
}

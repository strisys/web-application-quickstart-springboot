package org.strisys.data;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.strisys.data.rdms.PhotoRepository;
import org.strisys.model.entity.PhotoState;
import org.strisys.model.entity.Photo;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PhotoDataService {
    private final PhotoRepository repo;
    private final EntityManager em;

    public PhotoDataService(PhotoRepository repo, EntityManager em) {
        this.repo = repo;
        this.em = em;
    }

    public Photo tryGet(String id) {
        Optional<PhotoState> val = repo.findByUuid(id);
        return val.map(Photo::create).orElse(Photo.getNull());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Photo save(String fileName) {
        return save(fileName, new byte[0], "");
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Photo save(String fileName, byte[] bytes, String contentType) {
        PhotoState state = PhotoState.builder()
                .fileName(fileName)
                .uuid(UUID.randomUUID().toString())
                .file(bytes)
                .contentType(contentType)
                .build();

        return save(state);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Photo save(PhotoState state) {
        PhotoState saved = repo.save(state);
        repo.flush();

        return Photo.create(saved);
    }

    public Photo remove(String uuid) {
        Photo original = this.tryGet(uuid);

        if (original == null) {
            return Photo.getNull();
        }

        if (original.getIsNull()) {
            return original;
        }

        repo.deleteByUuid(uuid);
        repo.flush();

        return original;
    }

    public Collection<Photo> findAll() {
        List<PhotoState> values = repo.findAll();

        return values.stream()
                .map(Photo::create)
                .collect(Collectors.toList());
    }
}

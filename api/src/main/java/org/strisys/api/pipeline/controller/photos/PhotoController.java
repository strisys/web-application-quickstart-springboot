package org.strisys.api.pipeline.controller.photos;

import java.io.IOException;
import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.strisys.model.entity.Photo;
import org.strisys.model.entity.PhotoState;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.strisys.service.PhotoService;

@Slf4j
@RestController
@RequestMapping({"/photos"})
public class PhotoController {
    private final PhotoService service;

    public PhotoController(PhotoService service) {
        this.service = service;
    }

    @GetMapping({"", "/"})
    public Collection<PhotoState> getPhotos() {
        Collection<PhotoState> states = new ArrayList<>();

        for (Photo photo : service.getAll()) {
            PhotoState state = photo.getState();

            if (state != null) {
                states.add(state);
            }
        }

        return states;
    }

    @GetMapping("/{id}")
    public PhotoState getPhoto(@PathVariable String id) {
        PhotoState photoState = service.tryGet(id).getState();

        if  ((photoState == null) || (photoState.isNull())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return photoState;
    }

    @PostMapping()
    public ResponseEntity<PhotoState> setPhoto(@RequestBody @Valid PhotoState body) {
        ResponseEntity.BodyBuilder response = ResponseEntity.status(HttpStatus.CREATED);
        return response.body(service.save(body.getFileName()).getState());
    }

    @PostMapping("/upload")
    public ResponseEntity<PhotoState> uploadPhoto(@RequestPart("data") MultipartFile part) throws IOException {
        ResponseEntity.BodyBuilder response = ResponseEntity.status(HttpStatus.CREATED);
        byte[] bytes = part.getBytes();
        Photo photo = service.save(part.getOriginalFilename(), bytes, part.getContentType());
        return response.body(photo.getState());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadPhoto(@PathVariable String id) {
        PhotoState photoState = service.tryGet(id).getState();

        if  (photoState == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf(photoState.getContentType()));
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename(photoState.getFileName())
                .build());

        byte[] bytes = photoState.getFile();
        return ResponseEntity.ok().headers(headers).body(bytes);
    }

    @DeleteMapping("/{id}")
    public PhotoState deletePhoto(@PathVariable String id) {
        PhotoState photoState = service.remove(id).getState();

        if  (photoState == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return photoState;
    }
}

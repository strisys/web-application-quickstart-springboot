package org.strisys.api.pipeline.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.strisys.api.exception.ApiError;

import java.time.LocalDateTime;

@ControllerAdvice
public class DefaultExceptionHandler {

//    @ExceptionHandler(ResponseStatusException.class)
//    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException e, HttpServletRequest request) {
//        ApiError apiError = new ApiError(
//            request.getRequestURI(),
//            e.getMessage(),
//            HttpStatus.NOT_FOUND.value(),
//            LocalDateTime.now()
//        );
//
//        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
//    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleException(ResponseStatusException e, HttpServletRequest request) {
        ApiError apiError = new ApiError(
            request.getRequestURI(),
            e.getMessage(),
            e.getStatusCode().value(),
            LocalDateTime.now()
        );

        return new ResponseEntity<>(apiError, e.getStatusCode());
    }
}
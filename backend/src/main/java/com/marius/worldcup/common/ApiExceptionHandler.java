package com.marius.worldcup.common;

import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
  record ErrorRes(String message) {}

  @ExceptionHandler(ResponseStatusException.class)
  ResponseEntity<ErrorRes> handleResponseStatus(ResponseStatusException e) {
    var message = e.getReason() == null ? e.getStatusCode().toString() : e.getReason();
    return ResponseEntity.status(e.getStatusCode()).body(new ErrorRes(message));
  }

  @ExceptionHandler(DataAccessException.class)
  ResponseEntity<ErrorRes> handleDataAccess(DataAccessException e) {
    return ResponseEntity.internalServerError().body(new ErrorRes("Database operation failed"));
  }

  @ExceptionHandler(BadCredentialsException.class)
  ResponseEntity<ErrorRes> handleBadCredentials(BadCredentialsException e) {
    return ResponseEntity.status(401).body(new ErrorRes(e.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ErrorRes> handleUnexpected(Exception e) {
    return ResponseEntity.internalServerError().body(new ErrorRes("Unexpected server error"));
  }
}

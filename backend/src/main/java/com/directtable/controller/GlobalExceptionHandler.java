package com.directtable.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationErrors(
            MethodArgumentNotValidException e) {

        return ResponseEntity.badRequest()
                .body(
                    e.getBindingResult()
                     .getFieldErrors()
                     .get(0)
                     .getDefaultMessage()
                );
    }
}

package com.apisecurity.platform.exception;

/**
 * Thrown when a requested resource (scan, user) doesn't exist.
 * Maps to HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

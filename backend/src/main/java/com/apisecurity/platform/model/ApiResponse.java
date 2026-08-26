package com.apisecurity.platform.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Every API response is wrapped in this class.
 * Clients always get the same shape regardless of
 * success or failure.
 *
 * Success:
 * {
 *   "success": true,
 *   "message": "Analysis complete",
 *   "data": { ...the actual result... },
 *   "timestamp": "2024-01-15T10:30:00"
 * }
 *
 * Error:
 * {
 *   "success": false,
 *   "message": "Invalid file format",
 *   "data": null,
 *   "timestamp": "2024-01-15T10:30:00"
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // don't include null fields in JSON
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    // static factory methods — cleaner than calling builder every time

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}

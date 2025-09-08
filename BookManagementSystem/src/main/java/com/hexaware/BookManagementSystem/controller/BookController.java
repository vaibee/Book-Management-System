package com.hexaware.BookManagementSystem.controller;


import com.hexaware.BookManagementSystem.dto.BookDto;
import com.hexaware.BookManagementSystem.model.Book;
import com.hexaware.BookManagementSystem.service.BookService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService service;

    public BookController(BookService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<Book> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Book getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Book create(@RequestBody BookDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Book update(@PathVariable Long id, @RequestBody BookDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { service.delete(id); }
}

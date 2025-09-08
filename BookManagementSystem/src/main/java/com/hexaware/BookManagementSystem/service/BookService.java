package com.hexaware.BookManagementSystem.service;

import com.hexaware.BookManagementSystem.dto.BookDto;
import com.hexaware.BookManagementSystem.model.Book;
import com.hexaware.BookManagementSystem.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    public List<Book> getAll() {
        return repo.findAll();
    }

    public Book getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    public Book create(BookDto dto) {
        Book book = Book.builder()
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .yearPublished(dto.getYearPublished())
                .build();
        return repo.save(book);
    }

    public Book update(Long id, BookDto dto) {
        Book b = getById(id);
        b.setTitle(dto.getTitle());
        b.setAuthor(dto.getAuthor());
        b.setYearPublished(dto.getYearPublished());
        return repo.save(b);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
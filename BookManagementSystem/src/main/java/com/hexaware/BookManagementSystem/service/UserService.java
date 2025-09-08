package com.hexaware.BookManagementSystem.service;

import com.hexaware.BookManagementSystem.dto.UserDto;
import com.hexaware.BookManagementSystem.model.User;
import com.hexaware.BookManagementSystem.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User createUser(UserDto dto) {
        User user = User.builder()
                .username(dto.getUsername())
                .password(encoder.encode(dto.getPassword())) // BCrypt encoding
                .role(dto.getRole())
                .build();
        return repo.save(user);
    }
}

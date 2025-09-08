package com.hexaware.BookManagementSystem.controller;

import com.hexaware.BookManagementSystem.dto.UserDto;
import com.hexaware.BookManagementSystem.model.User;
import com.hexaware.BookManagementSystem.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) { // here i have injected UserSerivce by a constructor
        this.service = service;
    }

    @PostMapping
    public User createUser(@RequestBody UserDto dto) {
        return service.createUser(dto);
    }
}

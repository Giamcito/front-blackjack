package com.blackjack.user.delivery.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blackjack.user.domain.model.AppUser;
import com.blackjack.user.domain.repository.AppUserRepository;
import com.blackjack.user.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (repo.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Usuario ya existe");
        }
        AppUser u = AppUser.builder()
            .username(req.getUsername())
            .passwordHash(encoder.encode(req.getPassword()))
            .chips(1000)
            .build();
        repo.save(u);
        String token = jwtUtil.generateToken(u.getUsername());
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        AppUser u = repo.findByUsername(req.getUsername()).orElse(null);
        if (u == null || !encoder.matches(req.getPassword(), u.getPasswordHash())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
        String token = jwtUtil.generateToken(u.getUsername());
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @Data
    public static class RegisterRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Data
    public static class TokenResponse { private final String token; }
}

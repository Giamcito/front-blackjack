package com.blackjack.user.delivery.rest;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blackjack.user.domain.model.AppUser;
import com.blackjack.user.domain.repository.AppUserRepository;
import com.blackjack.user.security.JwtUtil;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final AppUserRepository repo;
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(name="Authorization", required=false) String authHeader) {
        AppUser u = userFromHeader(authHeader);
        if (u == null) return ResponseEntity.status(401).body("No autorizado");
        return ResponseEntity.ok(new MeResponse(u.getId(), u.getUsername(), u.getChips()));
    }

    @PostMapping("/chips/adjust")
    public ResponseEntity<?> adjust(@RequestHeader(name="Authorization", required=false) String authHeader,
                                    @RequestParam int delta) {
        AppUser u = userFromHeader(authHeader);
        if (u == null) return ResponseEntity.status(401).body("No autorizado");
        int next = Math.max(0, u.getChips() + delta);
        u.setChips(next);
        repo.save(u);
        return ResponseEntity.ok(new MeResponse(u.getId(), u.getUsername(), u.getChips()));
    }

    private AppUser userFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            return repo.findByUsername(username).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    @Data
    public static class MeResponse {
        private final Long id; private final String username; private final int chips;
    }
}

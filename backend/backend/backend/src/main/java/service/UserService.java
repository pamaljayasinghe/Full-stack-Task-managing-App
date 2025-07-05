package service;



import entity.User;
import repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // In-memory storage for tokens (for simplicity; use a database or cache in production)
    private Map<String, String> tokenStore = new HashMap<>();

    public User registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String token = UUID.randomUUID().toString();
            tokenStore.put(token, username);
            return token;
        }
        throw new RuntimeException("Invalid credentials");
    }

    public void forgotPassword(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        optionalUser.ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiration(LocalDateTime.now().plusHours(1));
            userRepository.save(user);
            System.out.println("Reset token for " + email + ": " + token);
        });
    }

    public void resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(token);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getResetTokenExpiration().isAfter(LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetToken(null);
                user.setResetTokenExpiration(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Reset token has expired");
            }
        } else {
            throw new RuntimeException("Invalid reset token");
        }
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public String validateToken(String token) {
        return tokenStore.get(token);
    }
}
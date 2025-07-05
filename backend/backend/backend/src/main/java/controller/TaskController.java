package controller;

import entity.Task;
import entity.User;
import jakarta.servlet.http.HttpServletResponse;
import repository.TaskRepository;
import repository.UserRepository;
import service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Task> getTasks(@RequestHeader("Authorization") String token) {
        String username = userService.validateToken(token.substring(7));
        if (username == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = new User(); // Placeholder, replace with userRepository.findByUsername(username)
        user.setUsername(username);
        return taskRepository.findByUser(user);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, @RequestHeader("Authorization") String token) {
        String username = userService.validateToken(token.substring(7));
        if (username == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = new User(); // Placeholder, replace with userRepository.findByUsername(username)
        user.setUsername(username);
        task.setUser(user);
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails, @RequestHeader("Authorization") String token) {
        String username = userService.validateToken(token.substring(7));
        if (username == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = new User(); // Placeholder, replace with userRepository.findByUsername(username)
        user.setUsername(username);
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getUsername().equals(user.getUsername())) {
            throw new RuntimeException("Unauthorized");
        }
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setDueDate(taskDetails.getDueDate());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        String username = userService.validateToken(token.substring(7));
        if (username == null) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }
        User user = new User(); // Placeholder, replace with userRepository.findByUsername(username)
        user.setUsername(username);
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getUsername().equals(user.getUsername())) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Unauthorized");
        }
        taskRepository.delete(task);
        return ResponseEntity.ok("Task deleted");
    }

    @GetMapping("/today")
    public List<Task> getTodayTasks(@RequestHeader("Authorization") String token) {
        String username = userService.validateToken(token.substring(7));
        if (username == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return taskRepository.findByUserAndDueDateBetween(user, startOfDay, endOfDay);
    }
}
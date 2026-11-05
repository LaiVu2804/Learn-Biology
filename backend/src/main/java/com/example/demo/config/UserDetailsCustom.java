package com.example.demo.config;

import com.example.demo.entity.Permission;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("userDetailsService")
public class UserDetailsCustom implements UserDetailsService {

    private final UserService userService;

    public UserDetailsCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userService.handleGetUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("username/password không hợp lệ !");
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() != null) {
            String roleName = user.getRole().getName();
            if (roleName != null && !roleName.isBlank()) {
                authorities.add(new SimpleGrantedAuthority(roleName));
            }
            if (user.getRole().getPermissions() != null) {
                for (Permission p : user.getRole().getPermissions()) {
                    authorities.add(new SimpleGrantedAuthority(p.getName()));
                }
            }
        }

        if (authorities.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                !user.isLocked(),
                true,
                true,
                !user.isLocked(),
                authorities
        );
    }
}

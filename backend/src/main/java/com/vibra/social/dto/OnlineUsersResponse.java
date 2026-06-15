package com.vibra.social.dto;

import com.vibra.social.websocket.PresenceEventListener.OnlineUserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OnlineUsersResponse {
    private Set<OnlineUserDTO> participants;
}

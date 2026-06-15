package com.vibra.identity.service;

import com.google.firebase.auth.FirebaseToken;

public interface FirebaseService {
    FirebaseToken verifyToken(String idToken);
}

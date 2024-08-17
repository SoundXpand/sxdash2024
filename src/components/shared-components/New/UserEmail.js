import React, { useState, useEffect } from 'react';
import { db } from 'configs/firebase'; 

const UserEmail = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Firebase Auth observer to get the current signed-in user
      const unsubscribe = db.onAuthStateChanged(user => {
        if (user) {
          setEmail(user.email || '');
        } else {
          setEmail('');
        }
        setLoading(false);
      });
  
      return () => unsubscribe(); // Unsubscribe on component unmount
    }, []);
  
    if (loading) {
      return null; // You can return a loader or null during loading phase
    }
  
    return <>{email}</>;
  };
  
  export default UserEmail;
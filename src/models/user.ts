/**
 * User-related types and interfaces
 */

// Complete user model (internal use only)
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed password
  createdAt: Date;
}

// Function to create a public version for API responses
export function publicUser(user: User) {
  // Extract password from user object, take all the remaining properties and return them as a new object
  const { password, ...publicData } = user;
  return publicData;
}

// Input for creating a new user
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User Model
 * Equivalent to Spring Boot User entity
 * @Document(collection = "User")
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || new Set();
    this.contactNo = data.contactNo || '';
  }

  /**
   * Get user ID
   * @returns {string|null}
   */
  getId() {
    return this.id;
  }

  /**
   * Set user ID
   * @param {string} id
   */
  setId(id) {
    this.id = id;
  }

  /**
   * Get user name
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Set user name
   * @param {string} name
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Get user email
   * @returns {string}
   */
  getEmail() {
    return this.email;
  }

  /**
   * Set user email
   * @param {string} email
   */
  setEmail(email) {
    this.email = email;
  }

  /**
   * Get user password
   * @returns {string}
   */
  getPassword() {
    return this.password;
  }

  /**
   * Set user password
   * @param {string} password
   */
  setPassword(password) {
    this.password = password;
  }

  /**
   * Get user roles
   * @returns {Set}
   */
  getRole() {
    return this.role;
  }

  /**
   * Set user roles
   * @param {Set|Array} role
   */
  setRole(role) {
    this.role = role instanceof Set ? role : new Set(role);
  }

  /**
   * Get contact number
   * @returns {string}
   */
  getContactNo() {
    return this.contactNo;
  }

  /**
   * Set contact number
   * @param {string} contactNo
   */
  setContactNo(contactNo) {
    this.contactNo = contactNo;
  }

  /**
   * Convert User instance to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: Array.from(this.role),
      contactNo: this.contactNo
    };
  }

  /**
   * Create User instance from plain object
   * @param {Object} data
   * @returns {User}
   */
  static fromJSON(data) {
    const user = new User(data);
    if (data.role) {
      user.setRole(data.role);
    }
    return user;
  }
}

export default User;


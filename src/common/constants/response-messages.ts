export const ResponseMessages = {
  EMPLOYEE: {
    CREATED: 'Employee successfully created',
    UPDATED: 'Employee successfully updated',
    DELETED: 'Employee successfully deleted',
    NOT_FOUND: 'Employee not found',
  },
  ATTENDANCE: {
    CHECKED_IN: 'Employee checked in successfully',
    CHECKED_OUT: 'Employee checked out successfully',
  },
  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully',
  },
  CATEGORY: {
    CREATED: 'Category created successfully',
    UPDATED: 'Category updated successfully',
    DELETED: 'Category deleted successfully',
    FETCHED: 'Category fetched successfully',
  },
  DEPARTMENT: {
    CREATED: 'Department created successfully',
    UPDATED: 'Department updated successfully',
    DELETED: 'Department deleted successfully',
    FETCHED: 'Department fetched successfully',
    NOT_FOUND: 'Department not found',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    LOGOUT_SUCCESS: 'Logout successful',
    PROFILE_FETCHED: 'Profile fetched successfully',
  },
  PAYROLL: {
    CREATED: 'Payroll created successfully',
    FETCHED: 'Payroll fetched successfully',
    UPDATED: 'Payroll updated successfully',
    PAID: 'Payroll marked as paid successfully',
    DELETED: 'Payroll deleted successfully',
  },
} as const;

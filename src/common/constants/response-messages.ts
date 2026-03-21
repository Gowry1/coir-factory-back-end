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
} as const;

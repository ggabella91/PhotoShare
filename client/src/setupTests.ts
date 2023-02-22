import '@testing-library/jest-dom/extend-expect';

if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = (() => {}) as any;
}

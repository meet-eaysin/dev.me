export function success<T>(data: T) {
  return {
    success: true,
    data,
  };
}

export function created<T>(data: T) {
  return {
    success: true,
    data,
  };
}

export function noContent() {
  return null;
}

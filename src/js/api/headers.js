import { API_KEY } from './constants'

/**
 * Generates headers for API requests, including API key and authorization token if available.
 * @param {boolean} includeContentType - Whether to include 'Content-Type' in headers (usually for requests with a body).
 * @returns {Headers} - A Headers object with the appropriate headers set.
 */
export function headers(includeContentType = true) {
  // Default to true for content type
  const headers = new Headers()

  // Add the API key from constants, as this should be a constant value in your project
  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY)
  }

  // Retrieve the token from localStorage and add it if available
  const token = localStorage.getItem('accessToken') // Consistent use of 'accessToken' for clarity
  if (token) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  // Optionally include Content-Type for requests with a JSON body
  if (includeContentType) {
    headers.append('Content-Type', 'application/json')
  }

  return headers
}

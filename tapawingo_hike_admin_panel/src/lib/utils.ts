import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum routeTypes {
  coördinaat = "Coördinaat",
  Afbeelding  = "Afbeelding",
  audio = "Audio",
}

export const API_BASE_URL = 'http://localhost:5175';
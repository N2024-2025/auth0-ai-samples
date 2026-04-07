import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';

/**
 * Auth0 Access Token Verification Middleware
 * 
 * Verifies JWT access token from Auth0
 * Attaches decoded user data to request object
 */

interface DecodedToken {
  sub: string;
  aud: string[];
  iss: string;
  exp: number;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        aud: string[];
        iss: string;
      };
    }
  }
}

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid Authorization header',
      });
    }

    const token = authHeader.substring(7);

    // Decode and verify token structure
    const decoded = jwtDecode<DecodedToken>(token);

    // Basic validation
    if (!decoded.sub) {
      return res.status(401).json({ error: 'Invalid token: missing sub claim' });
    }

    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Attach user info to request
    req.user = {
      sub: decoded.sub,
      aud: decoded.aud,
      iss: decoded.iss,
    };

    next();
  } catch (error: any) {
    console.error('Token verification error:', error);
    
    res.status(401).json({
      error: 'Invalid access token',
      details: error.message,
    });
  }
};

/**
 * Optional: Scope verification middleware
 * Checks if token has required scopes
 */
export const requireScope = (requiredScopes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' });
      }

      const token = authHeader.substring(7);
      const decoded = jwtDecode<any>(token);

      // Extract scopes from token
      const tokenScopes = (decoded.scope || '').split(' ');

      // Check if all required scopes are present
      const hasAllScopes = requiredScopes.every((scope) =>
        tokenScopes.includes(scope)
      );

      if (!hasAllScopes) {
        return res.status(403).json({
          error: `Missing required scopes: ${requiredScopes.join(', ')}`,
        });
      }

      next();
    } catch (error: any) {
      res.status(401).json({
        error: 'Invalid token',
        details: error.message,
      });
    }
  };
};

import toast from "react-hot-toast";

import { AxiosError } from "axios";
import { useAuthStore } from "../zustand/authStore";
import api from "../api/axios";
import { decodeRefreshToken } from "../utilities/helpers";
import { GeneralResponse } from "../types/globalTypes";
import {
  ChangePassDTO,
  LoginRequest,
  RegisterUserDTO,
  UserClaims,
} from "../types/authTypes";
import successModalInstance from "../utilities/successModalInstance";

const showMessage = (inputMessage: string) => {
  toast.success(inputMessage, {
    position: "top-center",
    duration: 5000,
  });
};

const handleError = (err: unknown) => {
  const error = err as AxiosError<GeneralResponse<object>>;
  const errorMessage = error.response?.data?.Message || "Something went wrong";
  toast.error(`Request Failed: \n${errorMessage}`, {
    style: {
      whiteSpace: "pre-line",
      fontSize: "0.875rem",
    },
  });
};

const showError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    duration: 5000,
  });
};

class AuthService {
  private initialized = false;

  private get store() {
    return useAuthStore.getState();
  }

  async login(payload: LoginRequest): Promise<boolean> {
    try {
      const response = await api.post("/auth/login", payload);
      const accessToken = response.data.Data.access_token;
      if (accessToken) {
        this.store.setAccessToken(accessToken);
        this.store.setAuthenticated(true);
        this.setClaims(accessToken);
        this.store.setUserAvatar(response.data.UserAvatar);
        this.store.setSystemAccess(response.data.Data.user_access);
        this.store.setUserFullName(response.data.Data.full_name);
      }
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.Message || "Invalid Credentials";
      showError(`Request Failed:\n${errorMessage}`);
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await api.post("/auth/refresh-token");
      const accessToken = response.data.Data.access_token;
      if (accessToken) {
        this.store.setAccessToken(accessToken);
        this.store.setAuthenticated(true);
        this.setClaims(accessToken);
        this.store.setSystemAccess(response.data.Data.user_access);
        this.store.setUserFullName(response.data.Data.full_name);
      }

      return true;
    } catch (error: any) {
      console.log(error);
      this.logout();
      return false;
    }
  }

  async logout(): Promise<string | null> {
    try {
      const response = await api.post("/auth/logout");
      this.store.clearAuth();
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async initializeAuth(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    this.store.setLoading(true);

    try {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        this.store.clearAuth();
      }
    } catch (error) {
      console.log(error);
      this.store.clearAuth();
    } finally {
      this.store.setLoading(false);
      this.store.setInitialized(true);
    }
  }

  hasRole(role: string): boolean {
    return this.store.userClaims?.role === role;
  }

  private setClaims(refreshToken: string): void {
    const DecodedClaims = decodeRefreshToken(refreshToken);
    if (!DecodedClaims) return;
    const userClaims: UserClaims = {
      id: DecodedClaims.nameid,
      email: DecodedClaims.email,
      role: DecodedClaims.role,
      fullName: DecodedClaims.fullName,
    };

    this.store.setUserClaims(userClaims);
    this.store.setUserFullName(userClaims.fullName);
  }

  async createUser(payload: RegisterUserDTO): Promise<boolean> {
    try {
      await api.post("/auth/register", payload);
      successModalInstance.show({
        hideDuration: 5000,
        message: `User ${payload.FirstName} ${payload.LastName} has been created successfully`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = error.response.data.Message || "Error creating user";
      showError(errorMessage);
      return false;
    }
  }

  async changePassword(payload: ChangePassDTO): Promise<boolean> {
    try {
      await api.put("/auth/change-pass", payload);
      showMessage("Password has been updated successfully.");
      return true;
    } catch (error: unknown) {
      handleError(error);
      return false;
    }
  }
}

export const authService = new AuthService();

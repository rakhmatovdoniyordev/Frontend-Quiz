import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { auth, googleProvider, githubProvider } from "../../firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

interface UserInfo {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthState {
  user: UserInfo | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  isInitialized: boolean // Yangi field qo'shdik
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  isInitialized: false, // Boshlang'ich holat
}

export const checkUser = createAsyncThunk<UserInfo | null>("auth/checkUser", async (_) => {
  return new Promise<UserInfo | null>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      } else {
        resolve(null)
      }
    })
  })
})

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      return {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message)
    }
  },
)

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      return {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message)
    }
  },
)

export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async (_, thunkAPI) => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    return {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName,
      photoURL: res.user.photoURL,
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const loginWithGithub = createAsyncThunk("auth/loginWithGithub", async (_, thunkAPI) => {
  try {
    const res = await signInWithPopup(auth, githubProvider)
    return {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName,
      photoURL: res.user.photoURL,
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth)
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // checkUser uchun case qo'shdik
      .addCase(checkUser.pending, (state) => {
        state.status = "loading"
        state.isInitialized = false
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = "succeeded"
        state.isInitialized = true // Initialized qildik
        state.error = null
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.user = null
        state.status = "failed"
        state.isInitialized = true
        state.error = action.error.message || "Authentication check failed"
      })

      .addCase(loginWithEmail.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = "succeeded"
        state.error = null
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

      .addCase(registerWithEmail.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = "succeeded"
        state.error = null
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = "succeeded"
        state.error = null
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

      .addCase(loginWithGithub.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginWithGithub.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = "succeeded"
        state.error = null
      })
      .addCase(loginWithGithub.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = "idle"
        state.error = null
      })
  },
})

export default authSlice.reducer

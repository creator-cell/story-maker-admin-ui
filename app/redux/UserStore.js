"use client";

import { createSlice, configureStore } from "@reduxjs/toolkit";
import { deleteCookie, setCookie } from "cookies-next/client";
import { debounce } from "lodash";
import { centerCanvas } from "../components/admin/fabric/fabric-utils";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
// ---------------- AUTH SLICE ----------------
const userSlice = createSlice({
  name: "auth",
  initialState: {
    user:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isLogin:
      typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLogin = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      setCookie("token", action.payload.token);
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.isLogin = false;
      state.token = null;
      state.user = null;
      deleteCookie("token");
    },
  },
});

// ---------------- EDITOR SLICE ----------------
const editorSlice = createSlice({
  name: "editor",
  initialState: {
    canvas: null,
    designId: null,
    isEditing: true,
    name: "Untitled Design",
    category: null,
    subCategory: null,
    showProperties: false,
    saveStatus: "saved",
    lastModified: Date.now(),
    isModified: false,
    userSubscription: null,
    userDesigns: [],
    userDesignsLoading: false,
    showPremiumModal: false,
    showDesignsModal: false,
  },
  reducers: {
    setCanvas(state, action) {
      state.canvas = action.payload;
      if (state.canvas) centerCanvas(state.canvas);
    },
    setDesignId(state, action) {
      state.designId = action.payload;
    },
    setIsEditing(state, action) {
      state.isEditing = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setShowProperties(state, action) {
      state.showProperties = action.payload;
    },
    setSaveStatus(state, action) {
      state.saveStatus = action.payload;
    },
    markAsModified(state) {
      if (state.designId) {
        state.lastModified = Date.now();
        state.saveStatus = "Saving...";
        state.isModified = true;
      } else {
        console.error("No design ID Available");
      }
    },
    setUserSubscription(state, action) {
      state.userSubscription = action.payload;
    },
    setUserDesigns(state, action) {
      state.userDesigns = action.payload;
    },
    setUserDesignsLoading(state, action) {
      state.userDesignsLoading = action.payload;
    },
    setShowPremiumModal(state, action) {
      state.showPremiumModal = action.payload;
    },
    setShowDesignsModal(state, action) {
      state.showDesignsModal = action.payload;
    },
    resetStore(state) {
      state.canvas = null;
      state.designId = null;
      state.isEditing = true;
      state.name = "Untitled Design";
      state.showProperties = false;
      state.saveStatus = "saved";
      state.isModified = false;
      state.lastModified = Date.now();
    },
  },
});
async function saveCanvasState(
  canvas,
  designId = null,
  title = "Untitled Design",
  category = null,
  subCategory = null
) {
  if (!canvas) return false;

  try {
    const canvasData = canvas.toJSON(["id", "filters"]);

    const designData = {
      name: title,
      content: JSON.stringify(canvasData),
    };
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${designId}`,
        designData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // toast.success("Template updated successfully");
      //router.push("/admin/template");
    } catch (err) {
      //  toast.error(err?.response?.data?.message || "Failed to update template");
    } finally {
      //  setLoader(false);
    }
    //return saveDesign(designData, designId);
  } catch (error) {
    console.error("Error saving canvas state:", error);
    throw error;
  }
}
// Async save handler
const saveToServer = () => async (dispatch, getState) => {
  const { canvas, designId, name } = getState().editor;

  if (!canvas || !designId) {
    console.log("No design ID or canvas instance is not available");
    return null;
  }

  try {
    await saveCanvasState(canvas, designId, name);
    dispatch(editorSlice.actions.setSaveStatus("Saved"));
    dispatch({ type: "editor/setModified", payload: false });
  } catch (e) {
    dispatch(editorSlice.actions.setSaveStatus("Error"));
  }
};

// Debounced save
const debouncedSaveToServer = debounce(
  (dispatch) => dispatch(saveToServer()),
  500
);

// ---------------- STORE ----------------
export const { login, logout } = userSlice.actions;
export const {
  setCanvas,
  setDesignId,
  setIsEditing,
  setName,
  setCategory,
  setSubCategory,
  setShowProperties,
  setSaveStatus,
  markAsModified,
  setUserSubscription,
  setUserDesigns,
  setUserDesignsLoading,
  setShowPremiumModal,
  setShowDesignsModal,
  resetStore,
} = editorSlice.actions;

export const userStore = configureStore({
  reducer: {
    auth: userSlice.reducer,
    editor: editorSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(() => (next) => (action) => {
      if (action.type === "editor/markAsModified") {
        debouncedSaveToServer(userStore.dispatch, userStore.getState);
      }
      return next(action);
    }),
});

// ---------------- CUSTOM HOOK ----------------
export const useEditorStore = () => {
  const dispatch = useDispatch();
  const editor = useSelector((state) => state.editor);

  return {
    ...editor,
    setCanvas: (canvas) => dispatch(setCanvas(canvas)),
    markAsModified: () => dispatch(markAsModified()),
    setDesignId: (id) => dispatch(setDesignId(id)),
    setIsEditing: (val) => dispatch(setIsEditing(val)),
    setName: (name) => dispatch(setName(name)),
    setCategory: (category) => dispatch(setCategory(category)),
    setSubCategory: (subCategory) => dispatch(setSubCategory(subCategory)),
    setShowProperties: (val) => dispatch(setShowProperties(val)),
    setSaveStatus: (status) => dispatch(setSaveStatus(status)),
    resetStore: () => dispatch(resetStore()),
  };
};

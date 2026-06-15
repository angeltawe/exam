// src/pages/Profile.jsx
// The account settings page. It has a profile header (avatar + identity) and
// two cards side by side: profile info and password change. Icons and a clear
// layout give it a professional, dashboard-like feel.

import { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiImage,
  FiMail,
  FiLock,
  FiSave,
  FiShield,
} from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Message from "../components/Message";
import Loader from "../components/Loader";

export default function Profile() {
  const { user, updateCachedUser } = useAuth();

  const [loading, setLoading] = useState(true);

  // --- Profile info state ---
  const [profile, setProfile] = useState({ name: "", phone: "", avatar: "" });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // --- Password change state ---
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [savingPw, setSavingPw] = useState(false);

  // Load the current profile once when the page mounts.
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const { data } = await api.get("/users/me", { signal: controller.signal });
        setProfile({
          name: data.user.name || "",
          phone: data.user.phone || "",
          avatar: data.user.avatar || "",
        });
      } catch (err) {
        if (err.name !== "CanceledError") {
          setProfileMsg({ type: "error", text: "Could not load your profile." });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  function handleProfileChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSavingProfile(true);
    try {
      const { data } = await api.put("/users/me", profile);
      updateCachedUser(data.user); // keep navbar/name in sync
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.message || "Could not update your profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  function handlePwChange(e) {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  }

  async function handlePwSubmit(e) {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });

    if (!pwForm.currentPassword || !pwForm.newPassword) {
      setPwMsg({ type: "error", text: "Please fill in both password fields." });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSavingPw(true);
    try {
      await api.put("/users/me/password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPwMsg({
        type: "error",
        text: err.response?.data?.message || "Could not change your password.",
      });
    } finally {
      setSavingPw(false);
    }
  }

  if (loading) return <Loader text="Loading your profile..." />;

  // Show the avatar if set, otherwise a circle with the user's initial.
  const initial = (profile.name || user?.username || "?").charAt(0).toUpperCase();

  return (
    <div className="container">
      {/* ---- Profile header ---- */}
      <div className="profile-header">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="Avatar"
            className="profile-avatar"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="profile-avatar-fallback">
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff" }}>
              {initial}
            </span>
          </div>
        )}
        <div>
          <h1>{profile.name || user?.username}</h1>
          <p style={{ margin: "4px 0 0", color: "#cfdcec", display: "flex", alignItems: "center", gap: 8 }}>
            <FiMail /> {user?.email}
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* ---- Section 1: Profile info ---- */}
        <div className="card">
          <h2 className="section-title">
            <FiUser /> Profile information
          </h2>
          <p className="section-sub">Update how others see you on PropSpace.</p>
          <Message type={profileMsg.type}>{profileMsg.text}</Message>

          <form onSubmit={handleProfileSubmit}>
            <InputField
              label="Display name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Jane Doe"
            />
            <InputField
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="+237 6 12 34 56 78"
            />
            <InputField
              label="Avatar image URL"
              name="avatar"
              value={profile.avatar}
              onChange={handleProfileChange}
              placeholder="https://example.com/me.jpg"
            />
            <button className="btn btn-primary" disabled={savingProfile}>
              <FiSave /> {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>

        {/* ---- Section 2: Change password ---- */}
        <div className="card">
          <h2 className="section-title">
            <FiShield /> Security
          </h2>
          <p className="section-sub">Change your password. We verify your current one first.</p>
          <Message type={pwMsg.type}>{pwMsg.text}</Message>

          <form onSubmit={handlePwSubmit}>
            <InputField
              label="Current password"
              name="currentPassword"
              type="password"
              value={pwForm.currentPassword}
              onChange={handlePwChange}
              required
            />
            <InputField
              label="New password"
              name="newPassword"
              type="password"
              value={pwForm.newPassword}
              onChange={handlePwChange}
              placeholder="At least 6 characters"
              required
            />
            <InputField
              label="Confirm new password"
              name="confirm"
              type="password"
              value={pwForm.confirm}
              onChange={handlePwChange}
              required
            />
            <button className="btn btn-primary" disabled={savingPw}>
              <FiLock /> {savingPw ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

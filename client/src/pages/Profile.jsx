// src/pages/Profile.jsx
// The account settings page. It has two independent sections:
//   1. Profile info  -> update name, phone, and avatar URL
//   2. Security      -> change the password (verifies the current one)
// Both show their own success/error messages so feedback is clear.

import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Message from "../components/Message";
import Loader from "../components/Loader";

export default function Profile() {
  const { updateCachedUser } = useAuth();

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

  return (
    <div className="container">
      <h1>Account settings</h1>

      {/* ---- Section 1: Profile info ---- */}
      <div className="card auth-box" style={{ maxWidth: 560, marginTop: 16 }}>
        <h2>Profile information</h2>
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
            placeholder="+1 555 123 4567"
          />
          <InputField
            label="Avatar image URL"
            name="avatar"
            value={profile.avatar}
            onChange={handleProfileChange}
            placeholder="https://example.com/me.jpg"
          />
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="Avatar preview"
              onError={(e) => (e.currentTarget.style.display = "none")}
              style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
            />
          )}
          <button className="btn btn-primary" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      {/* ---- Section 2: Change password ---- */}
      <div className="card auth-box" style={{ maxWidth: 560, marginTop: 24 }}>
        <h2>Change password</h2>
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
            {savingPw ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

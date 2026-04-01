import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../services/profileService";

const AGE_GROUPS = ["", "7-9", "10-13", "14-17", "18+"];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    setLoading(true);
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setFullName(data.full_name || "");
        setAgeGroup(data.age_group || "");
        setError("");
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const updated = await updateMyProfile({
        full_name: fullName,
        age_group: ageGroup,
      });
      setProfile(updated);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return null;

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Full Name</label>
          <br />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
            disabled={saving}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={profile.email}
            readOnly
            style={{ width: "100%", padding: 8, background: "#f4f4f4" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Role</label>
          <br />
          <input
            type="text"
            value={profile.role || ""}
            readOnly
            style={{ width: "100%", padding: 8, background: "#f4f4f4" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Age Group</label>
          <br />
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            disabled={saving}
          >
            {AGE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group ? group : "Select age group"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          style={{ width: "100%", padding: 10 }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {success && (
        <div style={{ color: "green", marginTop: 16 }}>{success}</div>
      )}
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default Profile;

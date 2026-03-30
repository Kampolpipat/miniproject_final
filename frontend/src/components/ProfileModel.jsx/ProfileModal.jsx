import React, { useState, useEffect } from "react";
import { Modal, useMantineTheme } from "@mantine/core";

function ProfileModal({ modalOpened, setModalOpened, profileData, onUpdate, onChangePassword }) {
    const theme = useMantineTheme();
    const [values, setValues] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        about: "",
        livesIn: "",
        worksAt: "",
        relationship: "",
        profilePicture: "",
        coverPicture: "",
        password: "",
        currentPassword: "",
        newPassword: "",
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');

    useEffect(() => {
        if (profileData) {
            setValues({
                firstname: profileData.firstname || "",
                lastname: profileData.lastname || "",
                username: profileData.username || "",
                email: profileData.email || "",
                about: profileData.about || "",
                livesIn: profileData.livesIn || "",
                worksAt: profileData.worksAt || "",
                relationship: profileData.relationship || "",
                profilePicture: profileData.profilePicture || "",
                coverPicture: profileData.coverPicture || "",
                password: "",
                currentPassword: "",
                newPassword: "",
            });
        }
    }, [profileData]);

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });

    const handleFile = async (e) => {
        const { name, files } = e.target;
        if (!files?.[0]) return;
        const base64 = await toBase64(files[0]);
        setValues((prev) => ({ ...prev, [name]: base64 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const profileUpdate = {
            firstname: values.firstname,
            lastname: values.lastname,
            username: values.username,
            email: values.email,
            about: values.about,
            livesIn: values.livesIn,
            worksAt: values.worksAt,
            relationship: values.relationship,
            profilePicture: values.profilePicture,
            coverPicture: values.coverPicture,
        };

        try {
            if (onUpdate) {
                await onUpdate(profileUpdate);
            }

            if (values.currentPassword && values.newPassword && onChangePassword) {
                await onChangePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                });
                setStatusMessage('Password updated successfully');
                setStatusType('success');
            }

            setStatusMessage('Profile updated successfully');
            setStatusType('success');
            setModalOpened(false);
        } catch (error) {
            console.error('Update Profile failed', error);
            setStatusMessage(error?.response?.data?.message || 'Update failed');
            setStatusType('error');
        }
    };

    return (
        <Modal
            overlayColor={
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            size="55%"
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
        >
            <form className="infoForm" onSubmit={handleSubmit}>
                <h3>Edit Profile</h3>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        value={values.firstname}
                        onChange={(e) => setValues({ ...values, firstname: e.target.value })}
                        placeholder="First Name"
                    />

                    <input
                        type="text"
                        className="infoInput"
                        value={values.lastname}
                        onChange={(e) => setValues({ ...values, lastname: e.target.value })}
                        placeholder="Last Name"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        value={values.username}
                        onChange={(e) => setValues({ ...values, username: e.target.value })}
                        placeholder="Username"
                    />

                    <input
                        type="email"
                        className="infoInput"
                        value={values.email}
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                        placeholder="Email"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        value={values.worksAt}
                        onChange={(e) => setValues({ ...values, worksAt: e.target.value })}
                        placeholder="Works at"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        value={values.livesIn}
                        onChange={(e) => setValues({ ...values, livesIn: e.target.value })}
                        placeholder="Lives in"
                    />

                    <input
                        type="text"
                        className="infoInput"
                        value={values.relationship}
                        onChange={(e) => setValues({ ...values, relationship: e.target.value })}
                        placeholder="Relationship Status"
                    />
                </div>

                <div>
                    <textarea
                        rows={3}
                        className="infoInput"
                        value={values.about}
                        onChange={(e) => setValues({ ...values, about: e.target.value })}
                        placeholder="About you"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        className="infoInput"
                        value={values.currentPassword}
                        onChange={(e) => setValues({ ...values, currentPassword: e.target.value })}
                        placeholder="Current password (required to change password)"
                    />
                    <input
                        type="password"
                        className="infoInput"
                        value={values.newPassword}
                        onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
                        placeholder="New password"
                    />
                </div>

                <div className="fileInputs">
                    <label className="fileLabel">
                        Profile Image
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFile}
                        />
                    </label>
                    <label className="fileLabel">
                        Cover Image
                        <input
                            type="file"
                            name="coverPicture"
                            accept="image/*"
                            onChange={handleFile}
                        />
                    </label>
                </div>

                <div style={{ marginTop: '8px' }}>
                    {statusMessage && (
                        <p style={{ color: statusType === 'success' ? '#0b8' : '#d33', fontSize: '0.9rem' }}>
                            {statusMessage}
                        </p>
                    )}
                </div>
                <button type="submit" className="button infoButton">
                    Update Profile
                </button>
            </form>
        </Modal>
    );
}

export default ProfileModal;

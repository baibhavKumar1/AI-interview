 import "../App.css"

interface UserProfile {
  profilePicture: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  password: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  closeModal: () => void;
  userData: UserProfile;
  onEditProfile: (updatedData: UserProfile) => void;
}



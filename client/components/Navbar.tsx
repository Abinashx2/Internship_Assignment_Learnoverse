import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  rightButton?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ 
  title = 'Learnoverse', 
  showBackButton = false, 
  showMenuButton = true,
  rightButton 
}) => {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleHome = () => {
    router.push('/');
    setIsMenuVisible(false);
  };

  const handleAbout = () => {
    router.push('/about');
    setIsMenuVisible(false);
  };

  const handleVideos = () => {
    router.push('/');
    setIsMenuVisible(false);
  };

  const handleContact = () => {
    // You can implement contact functionality here
    console.log('Contact pressed');
    setIsMenuVisible(false);
  };

  const MenuButton = () => (
    <TouchableOpacity 
      onPress={() => setIsMenuVisible(true)}
      style={styles.menuButton}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <View style={styles.menuIcon}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          {/* Left Section - Back Button or Menu */}
          <View style={styles.leftSection}>
            {showBackButton ? (
              <TouchableOpacity 
                onPress={handleBack}
                style={styles.backButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            ) : showMenuButton ? (
              <MenuButton />
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>

          {/* Center Section - Title */}
          <View style={styles.centerSection}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Right Section - Optional Button */}
          <View style={styles.rightSection}>
            {rightButton}
          </View>
        </View>
      </SafeAreaView>

      {/* Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Menu</Text>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleHome}
              >
                <Text style={styles.menuItemText}>🏠 Home</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleVideos}
              >
                <Text style={styles.menuItemText}>🎥 Videos</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleAbout}
              >
                <Text style={styles.menuItemText}>ℹ️ About</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleContact}
              >
                <Text style={styles.menuItemText}>📞 Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, styles.closeButton]}
                onPress={() => setIsMenuVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  leftSection: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#ff0000',
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  placeholder: {
    width: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 56, // Below navbar
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuContent: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff0000',
    borderRadius: 8,
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Navbar;
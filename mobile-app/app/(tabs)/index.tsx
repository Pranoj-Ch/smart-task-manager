import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Text, TextInput, View, Button, Platform, Alert, StyleSheet, FlatList } from "react-native";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status?: string;
};

export default function HomeScreen() {

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register states
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [userName, setUserName] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedName = await AsyncStorage.getItem("userName");

      if (token) {
        setIsLoggedIn(true);
        setUserName(storedName || "");
        fetchTasks();
      }
    };

    checkLogin();
  }, []);


  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch("http://192.168.1.19:5000/api/tasks", {
        headers: {
          Authorization: token || "",
        },
      });

      const data = await response.json();

      console.log("TASKS RESPONSE:", data);


      if (Array.isArray(data)) {
        setTasks(data);
      } else if (Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }

    } catch (error) {
      console.log("Error fetching tasks");
    }
  };


  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.19:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await response.json();

      if (!loginEmail || !loginPassword) {
        showMessage("Error", "All fields are required");
        setLoginEmail("");
        setLoginPassword("");
        return;
      }

      else if (!isValidEmail(loginEmail)) {
        showMessage("Error", "Enter a valid email address");
        setLoginEmail("");
        setLoginPassword("");
        return;

      }

      else if (!isValidPassword(loginPassword)) {
        showMessage("Error", "Password must be at least 6 characters");
        setLoginEmail("");
        setLoginPassword("");
        return;
      }

      if (!response.ok) {
        // Alert.alert("Login Failed", data.msg || "Invalid credentials");
        showMessage("Login Failed", data.msg || "Invalid credentials");
        setLoginEmail("");
        setLoginPassword("");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("userName", data.user?.name || "");

      setUserName(data.user?.name || "");
      setIsLoggedIn(true);

      setLoginEmail("");
      setLoginPassword("");

      fetchTasks();

    } catch (error) {
      // Alert.alert("Error", "Server connection failed");
      showMessage("Error", "Server connection failed");
    }
  };


  const handleRegister = async () => {
    try {

      if (!registerName || !registerEmail || !registerPassword) {
        //Alert.alert("Error", "All fields are required");
        showMessage("Error", "All fields are required");
        return;
      }

      const response = await fetch("http://192.168.1.19:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName.trim(),
          email: registerEmail.trim(),
          password: registerPassword.trim(),
        }),

      });

      const data = await response.json();

      if (!registerName || !registerEmail || !registerPassword) {
        showMessage("Error", "All fields are required");
        return;
      }

      if (!isValidEmail(registerEmail)) {
        showMessage("Error", "Enter a valid email address");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        return;
      }

      if (!isValidPassword(registerPassword)) {
        showMessage("Error", "Password must be at least 6 characters");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        return;
      }

      if (!response.ok) {
        // Alert.alert("Error", data.msg || "Registration failed");
        showMessage("Error", data.msg || "Registration failed");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
      }

      //Alert.alert("Success", "Account created successfully. Please login.");
      showMessage("Success", "Account created successfully. Please login.");

      setIsRegistering(false);

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");

    } catch (error) {
      // Alert.alert("Error", "Server connection failed");
      showMessage("Error", "Server connection failed");
    }
  };

  const addTask = async () => {
    try {

      if (!newTask.trim()) {
        // Alert.alert("Error", "Task title cannot be empty");
        showMessage("Error", "Task title cannot be empty");

        return;
      }

      const token = await AsyncStorage.getItem("token");

      const response = await fetch("http://192.168.1.19:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          title: newTask.trim(),
          status: "Pending"
        }),
      });

      if (response.ok) {
        setNewTask("");
        fetchTasks();
      } else {
        // Alert.alert("Error", "Failed to add task");
        showMessage("Error", "Failed to add task");

      }

    } catch (error) {
      // Alert.alert("Error", "Server error while adding task");
      showMessage("Error", "Server error while adding task");
    }
  };

  const deleteTask = async (id: string) => {
    try {

      const token = await AsyncStorage.getItem("token");

      await fetch(`http://192.168.1.19:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      });

      fetchTasks();

    } catch (error) {

      console.log("Error deleting task");

    }
  };


  const updateTaskStatus = async (id: string, newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`http://192.168.1.19:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.log("Error updating task");
    }
  };


  // const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  // const progress =
  //   tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);


  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const completedTasks = safeTasks.filter((t) => t.status === "Completed").length;

  const progress =
    safeTasks.length === 0
      ? 0
      : Math.round((completedTasks / safeTasks.length) * 100);


  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesFilter =
      filterStatus === "All" || task.status === filterStatus;

    return matchesSearch && matchesFilter;
  });


  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.trim().length >= 6; // minimum 6 chars
  };


  const showMessage = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <View style={styles.container}>

      {!isLoggedIn && !isRegistering && (

        <>
          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Email"
            value={loginEmail}
            onChangeText={setLoginEmail}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            value={loginPassword}
            secureTextEntry
            onChangeText={setLoginPassword}
            style={styles.input}
          />

          <Button title="Login" onPress={handleLogin} />

          <Button
            title="Create Account"
            onPress={() => {
              setIsRegistering(true);
              setLoginEmail("");
              setLoginPassword("");
            }}
          />
        </>
      )}

      {isRegistering && (

        <>
          <Text style={styles.title}>Register</Text>

          <TextInput
            placeholder="Name"
            value={registerName}
            onChangeText={setRegisterName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            value={registerEmail}
            onChangeText={setRegisterEmail}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            value={registerPassword}
            secureTextEntry
            onChangeText={setRegisterPassword}
            style={styles.input}
          />

          <Button title="Register" onPress={handleRegister} />

          <Button
            title="Back to Login"
            onPress={() => {
              setIsRegistering(false);
              setRegisterName("");
              setRegisterEmail("");
              setRegisterPassword("");
            }}
          />
        </>
      )}

      {isLoggedIn && (

        <>
          <Text style={{ fontSize: 22 }}>Welcome, {userName} 👋</Text>

          <Button
            title="Logout"
            onPress={async () => {
              await AsyncStorage.removeItem("token");
              setIsLoggedIn(false);
              setTasks([]);
            }}
          />

          <Text style={{ marginTop: 10 }}>Progress: {progress}%</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <TextInput
            placeholder="Search tasks..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Button title="All" onPress={() => setFilterStatus("All")} />
            <Button title="In Progress" onPress={() => setFilterStatus("In Progress")} />
            <Button title="Pending" onPress={() => setFilterStatus("Pending")} />
            <Button title="Completed" onPress={() => setFilterStatus("Completed")} />
          </View>

          <TextInput
            placeholder="New Task"
            value={newTask}
            onChangeText={setNewTask}
            style={styles.input}
          />

          <Button title="Add Task" onPress={addTask} />

          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text>No tasks yet!</Text>}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>

                <Text style={{ fontSize: 16 }}>{item.title}</Text>

                <Text
                  style={{
                    color:
                      item.status === "Completed"
                        ? "green"
                        : item.status === "In Progress"
                          ? "blue"
                          : "orange",
                    fontWeight: "bold",
                  }}
                >
                  Status: {item.status}
                </Text>

                {/* <Text>Status: {item.status}</Text> */}

                {item.status === "Pending" && (
                  <Button
                    title="Start Task"
                    onPress={() => updateTaskStatus(item._id, "In Progress")}
                  />
                )}

                {item.status === "In Progress" && (
                  <Button
                    title="Mark Completed"
                    onPress={() => updateTaskStatus(item._id, "Completed")}
                  />
                )}

                <Button
                  title="Delete"
                  onPress={() => deleteTask(item._id)}
                />
              </View>
            )}
          />
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskCard: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonSpacing: {
    marginTop: 5,
    marginBottom: 5
  },
  progressBar: {
    height: 10,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
});
const BASE_URL = "http://localhost:5000";

export const getTasks = () => {
    return fetch(`${BASE_URL}/tasks`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch tasks");
            }
            return res.json();
        });
};

export const createTask = (task) => {
    return fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Failed to create task");
        }
        return res.json();
    });
};
export const deleteTask = (id) => {
    return fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Failed to delete task");
        }

        return res.json();
    });
};
export const updateTask = (id, task) => {
    return fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Failed to update task");
        }

        return res.json();
    });
};
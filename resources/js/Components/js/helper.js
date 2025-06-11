const getCategories = async () => {
    try {
        const response = await axios.get(route("category.data"));
        return response;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

const getQuizCategories = async () => {
    try {
        const response = await axios.get(route("quizcategory.data"));
        return response;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

const getTypes = async () => {
    try {
        const response = await axios.get(route("type.data"));
        return response;
    } catch (error) {
        console.error("Error fetching question types:", error);
    }
};

export { getCategories, getQuizCategories, getTypes };

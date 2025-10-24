(function () {
    window.app = {
        baseUrl: "",
        getUrl: (path) => {
            return `${window.app.baseUrl}/api/photos/${path}`
        },
        upload: async function (file) {
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            // Check if a file is provided
            if (!file) {
                alert("Please select or drop a file to upload.");
                return;
            }

            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please select or drop an image file.");
                return;
            }

            // Validate file size
            if (file.size > maxSizeInBytes) {
                alert("File is too large. Maximum size allowed is 5MB.");
                return;
            }

            const formData = new FormData();
            formData.append("data", file);

            try {
                const response = await fetch(window.app.getUrl("upload"), {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.statusText}`);
                }

                return (await response.text());
            } catch (error) {
                console.error("Error uploading file:", error);
                alert(`Error uploading file: ${error.message}`);
            }
        },
        fetchPhotos: async function () {
            try {
                const response = await fetch(window.app.getUrl(""), {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch photos: ${response.statusText}`);
                }

                const photos = await response.json();
                return photos.filter(photo => photo.contentType);
            } catch (error) {
                console.error("Error fetching photos:", error);
                alert(`Error fetching photos: ${error.message}`);
                return [];
            }
        },

        downloadPhoto: async function (id) {
            try {
                const response = await fetch(window.app.getUrl(`download/${id}`), {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error(`Failed to download photo: ${response.statusText}`);
                }

                // Extract filename from content-disposition header
                const contentDisposition = response.headers.get('content-disposition');
                let filename = 'downloaded-photo';

                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="([^"]+)"/);
                    if (match && match[1]) {
                        filename = match[1];
                    }
                }

                // Create a blob and trigger download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                return {
                    blob,
                    url,
                    filename
                }
            } catch (error) {
                console.error("Error downloading photo:", error);
                alert(`Error downloading photo: ${error.message}`);
            }
        }
    };
})();

async function uploadFile() {
    const file = window.appElements.fileInput.files[0];
    await window.app.upload(file);

    // Clear the file input and update UI after successful upload
    window.appElements.fileInput.value = ''; // Clear the file input
    window.appElements.dropArea.textContent = 'Drag and drop your image here or click to select';
    window.appElements.uploadButton.disabled = true;
    window.appElements.uploadButton.classList.add('opacity-50', 'cursor-not-allowed');

    // Refresh the photos table
    const photos = await window.app.fetchPhotos();
    renderPhotos(photos);
}

function renderPhotos(photos) {
    const tbody = window.appElements.photosTableBody;
    const container = window.appElements.photosTableContainer;
    tbody.innerHTML = '';

    if (!photos.length) {
        container.classList.add('hidden');
        return;
    }

    const createRow = (photo) => {
        const row = document.createElement('tr');

        row.innerHTML = `
                <td class="border border-gray-300 p-2">${photo.fileName}</td>
                <td class="border border-gray-300 p-2 text-center">
                    <a href="#" onclick="downloadPhoto('${photo.uuid}'); return false;" class="text-blue-500 hover:text-blue-700">
                        <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                    </a>
                </td>
            `;

        tbody.appendChild(row);
    }

    photos.forEach(createRow);
    container.classList.remove('hidden');
}

async function downloadPhoto(id) {
    try {
        const result = await window.app.downloadPhoto(id);

        if (!result || !result.url || !result.filename) {
            alert("Failed to download file. Invalid response from server.");
            return;
        }

        const { url, filename } = result;
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
        console.error("Error in downloadPhoto:", error);
        alert(`Error downloading photo: ${error.message}`);
    }
}

function collectElements() {
    window.appElements = {
        dropArea: document.getElementById("drop-area"),
        fileInput: document.getElementById("fileupload"),
        uploadButton: document.getElementById("upload-button"),
        photosTableBody: document.getElementById("photos-table-body"),
        photosTableContainer: document.getElementById("photos-table-container")
    };
}

function setupApp() {
    collectElements();

    // Function to set up drag-and-drop functionality
    function setupDragAndDrop() {
        // Prevent default drag behaviors
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Add event listeners for drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            window.appElements.dropArea.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when dragging over
        ['dragenter', 'dragover'].forEach(eventName => {
            window.appElements.dropArea.addEventListener(eventName, () => {
                window.appElements.dropArea.classList.add('bg-gray-200', 'border-gray-800');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            window.appElements.dropArea.addEventListener(eventName, () => {
                window.appElements.dropArea.classList.remove('bg-gray-200', 'border-gray-800');
            }, false);
        });

        // Handle dropped files
        window.appElements.dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 1) {
                alert("Please drop only one file.");
                return;
            }
            window.appElements.fileInput.files = files; // Assign dropped file to file input
            updateButtonState();
        }, false);
    }

    // Update button state and drop area text
    function updateButtonState() {
        if (window.appElements.fileInput.files.length === 1) {
            window.appElements.uploadButton.disabled = false;
            window.appElements.uploadButton.classList.remove('opacity-50', 'cursor-not-allowed');
            window.appElements.dropArea.textContent = `Selected: ${window.appElements.fileInput.files[0].name}`;
        } else {
            window.appElements.uploadButton.disabled = true;
            window.appElements.uploadButton.classList.add('opacity-50', 'cursor-not-allowed');
            window.appElements.dropArea.textContent = 'Drag and drop your image here or click to select';
        }
    }

    // Disable button initially
    window.appElements.uploadButton.disabled = true;
    window.appElements.uploadButton.classList.add('opacity-50', 'cursor-not-allowed');

    // Set up drag-and-drop functionality
    setupDragAndDrop();

    // Allow clicking the drop area to trigger file input
    window.appElements.dropArea.addEventListener('click', () => {
        window.appElements.fileInput.click();
    });

    // Handle file input change
    window.appElements.fileInput.addEventListener('change', () => {
        if (window.appElements.fileInput.files.length > 1) {
            alert("Please select only one file.");
            window.appElements.fileInput.value = ''; // Clear the input
        }
        updateButtonState();
    });

    // Fetch and display photos initially
    window.app.fetchPhotos().then(photos => {
        renderPhotos(photos);
    });
}

document.addEventListener("DOMContentLoaded", setupApp);
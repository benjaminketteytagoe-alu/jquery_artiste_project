/**
 * Artiste Gallery — jQuery Application
 * CRUD operations with MockAPI
 */

(function($) {
  'use strict';

  // Configuration

  const API_BASE = 'https://6af216af42c6561ced38fedf.mockapi.io';
  const API_ENDPOINT = '/artiste';
  const STORAGE_KEY = 'artiste_gallery_data';


  // Sample Data (seeded on first run)

  const SAMPLE_ARTISTES = [
    {
      name: 'Adele',
      genre: 'Pop',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'British singer known for her powerful voice and emotional ballads.',
      socials: 'https://instagram.com/adele'
    },
    {
      name: 'John Legend',
      genre: 'R&B',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Grammy-winning artist celebrated for soulful vocals and piano-driven compositions.',
      socials: 'https://instagram.com/johnlegend'
    },
    {
      name: 'Ella Fitzgerald',
      genre: 'Jazz',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a49daeb?w=400&h=400&fit=crop',
      bio: 'Legendary jazz vocalist known as the First Lady of Song with an impeccable scat singing style.',
      socials: 'https://en.wikipedia.org/wiki/Ella_Fitzgerald'
    },
    {
      name: 'The Weeknd',
      genre: 'R&B',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Canadian singer and songwriter blending dark R&B with pop sensibilities.',
      socials: 'https://instagram.com/theweeknd'
    },
    {
      name: 'Billie Eilish',
      genre: 'Pop',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      bio: 'Genius-level songwriter and performer redefining pop music for a new generation.',
      socials: 'https://instagram.com/billieeilish'
    },
    {
      name: 'Miles Davis',
      genre: 'Jazz',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Revolutionary trumpeter who reshaped jazz multiple times throughout his career.',
      socials: 'https://en.wikipedia.org/wiki/Miles_Davis'
    },
    {
      name: 'Dua Lipa',
      genre: 'Pop',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
      bio: 'British-Albanian pop star known for disco-infused hits and captivating stage presence.',
      socials: 'https://instagram.com/dualipa'
    },
    {
      name: 'Nas',
      genre: 'Hip-Hop',
      image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop',
      bio: 'Queens-born lyricist widely regarded as one of the greatest hip-hop storytellers.',
      socials: 'https://instagram.com/nas'
    },
    {
      name: 'Sade',
      genre: 'Soul',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      bio: 'Nigerian-British icon whose smooth soul and elegant style defined a generation.',
      socials: 'https://instagram.com/sade'
    }
  ];


  // State

  let allArtistes = [];
  let deleteTargetId = null;
  let useLocalStorage = false; // Switched to true if MockAPI fails


  // Utility: Toast Notifications

  function showToast(message, type) {
    type = type || 'info';
    var $toast = $('<div class="toast toast--' + type + '">' + message + '</div>');
    $('#toastContainer').append($toast);
    setTimeout(function() {
      $toast.css('animation', 'slideOut 0.3s ease forwards');
      setTimeout(function() {
        $toast.remove();
      }, 300);
    }, 3000);
  }


  // LocalStorage Helpers

  function loadFromStorage() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) { /* ignore */ }
    // Seed sample data on first run
    var seeded = JSON.parse(JSON.stringify(SAMPLE_ARTISTES));
    seeded.forEach(function(a, i) { a.id = (i + 1).toString(); });
    saveToStorage(seeded);
    return seeded;
  }

  function saveToStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }


  // API: Fetch All Artistes

  function fetchArtistes() {
    $('#loadingIndicator').show();
    $('#artisteGrid').empty();
    $('#emptyState').hide();

    if (useLocalStorage) {
      // Use localStorage directly
      allArtistes = loadFromStorage();
      populateGenreFilter();
      renderArtistes(allArtistes);
      $('#loadingIndicator').hide();
      return;
    }

    $.ajax({
      url: API_BASE + API_ENDPOINT,
      method: 'GET',
      timeout: 5000,
      success: function(data) {
        if (data && data.length > 0) {
          allArtistes = data;
          useLocalStorage = false;
          populateGenreFilter();
          renderArtistes(allArtistes);
        } else {
          // Empty response — fall back to localStorage
          fallbackToLocal();
        }
        $('#loadingIndicator').hide();
      },
      error: function() {
        // MockAPI not available — fall back to localStorage
        fallbackToLocal();
        $('#loadingIndicator').hide();
      }
    });
  }

  function fallbackToLocal() {
    useLocalStorage = true;
    allArtistes = loadFromStorage();
    populateGenreFilter();
    renderArtistes(allArtistes);
    showToast('Running in offline mode with sample data.', 'info');
  }


  // API: Create Artiste

  function createArtiste(data) {
    if (useLocalStorage) {
      // LocalStorage create
      var maxId = allArtistes.reduce(function(max, a) {
        return Math.max(max, parseInt(a.id) || 0);
      }, 0);
      data.id = (maxId + 1).toString();
      allArtistes.push(data);
      saveToStorage(allArtistes);
      closeModal();
      showToast('Artiste added successfully!', 'success');
      populateGenreFilter();
      renderArtistes(allArtistes);
      return;
    }

    $.ajax({
      url: API_BASE + API_ENDPOINT,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function() {
        closeModal();
        showToast('Artiste added successfully!', 'success');
        fetchArtistes();
      },
      error: function() {
        showToast('Failed to add artiste. Please try again.', 'error');
      }
    });
  }


  // API: Update Artiste

  function updateArtiste(id, data) {
    if (useLocalStorage) {
      // LocalStorage update
      var index = allArtistes.findIndex(function(a) { return a.id == id; });
      if (index !== -1) {
        data.id = id;
        allArtistes[index] = data;
        saveToStorage(allArtistes);
        closeModal();
        showToast('Artiste updated successfully!', 'success');
        renderArtistes(allArtistes);
      } else {
        closeModal();
        showToast('Artiste not found.', 'error');
      }
      return;
    }

    $.ajax({
      url: API_BASE + API_ENDPOINT + '/' + id,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function() {
        closeModal();
        showToast('Artiste updated successfully!', 'success');
        fetchArtistes();
      },
      error: function() {
        showToast('Failed to update artiste. Please try again.', 'error');
      }
    });
  }


  // API: Delete Artiste

  function deleteArtiste(id) {
    if (useLocalStorage) {
      // LocalStorage delete
      allArtistes = allArtistes.filter(function(a) { return a.id != id; });
      saveToStorage(allArtistes);
      closeDeleteModal();
      showToast('Artiste removed successfully!', 'success');
      populateGenreFilter();
      renderArtistes(allArtistes);
      return;
    }

    $.ajax({
      url: API_BASE + API_ENDPOINT + '/' + id,
      method: 'DELETE',
      success: function() {
        closeDeleteModal();
        showToast('Artiste removed successfully!', 'success');
        fetchArtistes();
      },
      error: function() {
        closeDeleteModal();
        showToast('Failed to delete artiste. Please try again.', 'error');
      }
    });
  }


  // Render: Artiste Cards

  function renderArtistes(artisteList) {
    var $grid = $('#artisteGrid');
    $grid.empty();

    if (artisteList.length === 0) {
      $('#emptyState').show();
      return;
    }

    $('#emptyState').hide();

    $.each(artisteList, function(index, artiste) {
      var id = artiste.id || (index + 1);
      var name = artiste.name || 'Unknown';
      var genre = artiste.genre || 'N/A';
      var image = artiste.image || '';
      var bio = artiste.bio || 'No bio available.';

      var cardHtml = '' +
        '<div class="artiste-card" data-id="' + id + '">' +
          '<div class="artiste-card__image-wrapper">' +
            (image ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(name) + '" class="artiste-card__image" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22320%22><rect fill=%22%232a2a2a%22 width=%22300%22 height=%22320%22/><text fill=%22%236b6560%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22>No Image</text></svg>\'">' : '<div class="artiste-card__image" style="display:flex;align-items:center;justify-content:center;color:#6b6560;font-size:0.9rem;">No Image</div>') +
            '<span class="artiste-card__genre-badge">' + escapeHtml(genre) + '</span>' +
            '<span class="artiste-card__id-badge">ID: ' + escapeHtml(String(id)) + '</span>' +
          '</div>' +
          '<div class="artiste-card__body">' +
            '<h3 class="artiste-card__name">' + escapeHtml(name) + '</h3>' +
            '<p class="artiste-card__bio">' + escapeHtml(bio) + '</p>' +
            '<div class="artiste-card__actions">' +
              '<button class="artiste-card__action-btn btn-edit" data-id="' + id + '">' +
                '<span>✎</span> Edit' +
              '</button>' +
              '<button class="artiste-card__action-btn artiste-card__action-btn--delete btn-delete" data-id="' + id + '">' +
                '<span>✕</span> Delete' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      $grid.append(cardHtml);
    });
  }


  // Escape HTML to prevent XSS

  function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
  }


  // Populate Genre Filter Dropdown

  function populateGenreFilter() {
    var genres = [];
    $.each(allArtistes, function(i, a) {
      if (a.genre && genres.indexOf(a.genre) === -1) {
        genres.push(a.genre);
      }
    });
    genres.sort();

    var $select = $('#filterGenre');
    $select.find('option:not(:first)').remove();
    $.each(genres, function(i, g) {
      $select.append('<option value="' + escapeHtml(g) + '">' + escapeHtml(g) + '</option>');
    });
  }


  // Search & Filter Logic

  function applyFilters() {
    var query = $('#searchInput').val().toLowerCase().trim();
    var genre = $('#filterGenre').val();
    var sortBy = $('#sortBy').val();

    var filtered = allArtistes.filter(function(a) {
      var matchName = !query || (a.name && a.name.toLowerCase().indexOf(query) !== -1);
      var matchGenre = !genre || (a.genre && a.genre === genre);
      return matchName && matchGenre;
    });

    // Sort
    switch (sortBy) {
      case 'name-asc':
        filtered.sort(function(a, b) { return (a.name || '').localeCompare(b.name || ''); });
        break;
      case 'name-desc':
        filtered.sort(function(a, b) { return (b.name || '').localeCompare(a.name || ''); });
        break;
      case 'newest':
        filtered.sort(function(a, b) { return (b.id || 0) - (a.id || 0); });
        break;
      case 'oldest':
        filtered.sort(function(a, b) { return (a.id || 0) - (b.id || 0); });
        break;
    }

    renderArtistes(filtered);
  }


  // Modal: Open / Close

  function openModal(artiste) {
    artiste = artiste || null;
    if (artiste) {
      $('#modalTitle').text('Edit Artiste');
      $('#btnSubmit').text('Update Artiste');
      $('#artisteId').val(artiste.id);
      $('#inputName').val(artiste.name || '');
      $('#inputGenre').val(artiste.genre || '');
      $('#inputImage').val(artiste.image || '');
      $('#inputBio').val(artiste.bio || '');
      $('#inputSocials').val(artiste.socials || '');
      if (artiste.image) {
        $('#previewImg').attr('src', artiste.image);
        $('#imagePreview').addClass('has-image');
      } else {
        $('#previewImg').removeAttr('src');
        $('#imagePreview').removeClass('has-image');
      }
    } else {
      $('#modalTitle').text('Add New Artiste');
      $('#btnSubmit').text('Save Artiste');
      $('#artisteForm')[0].reset();
      $('#artisteId').val('');
      $('#previewImg').removeAttr('src');
      $('#imagePreview').removeClass('has-image');
    }
    $('#modalOverlay').addClass('active');
  }

  function closeModal() {
    $('#modalOverlay').removeClass('active');
  }

  function openDeleteModal(name) {
    deleteTargetId = name; // we'll pass id via data attribute
    $('#deleteArtisteName').text(name);
    $('#deleteOverlay').addClass('active');
  }

  function closeDeleteModal() {
    $('#deleteOverlay').removeClass('active');
    deleteTargetId = null;
  }


  // Event Handlers


  // Add Artiste button
  $(document).on('click', '#btnAddArtiste', function() {
    openModal();
  });

  // Edit Artiste button (delegated)
  $(document).on('click', '.btn-edit', function() {
    var id = $(this).data('id');
    var artiste = allArtistes.find(function(a) { return a.id == id; });
    if (artiste) {
      openModal(artiste);
    }
  });

  // Delete Artiste button (delegated)
  $(document).on('click', '.btn-delete', function() {
    var id = $(this).data('id');
    var artiste = allArtistes.find(function(a) { return a.id == id; });
    if (artiste) {
      deleteTargetId = id;
      $('#deleteArtisteName').text(artiste.name || 'this artiste');
      $('#deleteOverlay').addClass('active');
    }
  });

  // Close modals
  $('#modalClose, #btnCancel').on('click', closeModal);
  $('#deleteClose, #btnCancelDelete').on('click', closeDeleteModal);

  // Close on overlay click
  $('#modalOverlay').on('click', function(e) {
    if (e.target === this) closeModal();
  });
  $('#deleteOverlay').on('click', function(e) {
    if (e.target === this) closeDeleteModal();
  });

  // Close on Escape key
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
      closeDeleteModal();
    }
  });

  // Form submit (Create / Update)
  $('#artisteForm').on('submit', function(e) {
    e.preventDefault();

    var id = $('#artisteId').val();
    var data = {
      name:    $('#inputName').val().trim(),
      genre:   $('#inputGenre').val().trim(),
      image:   $('#inputImage').val().trim(),
      bio:     $('#inputBio').val().trim(),
      socials: $('#inputSocials').val().trim()
    };

    if (!data.name || !data.genre || !data.image) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (id) {
      updateArtiste(id, data);
    } else {
      createArtiste(data);
    }
  });

  // Confirm delete
  $('#btnConfirmDelete').on('click', function() {
    if (deleteTargetId) {
      deleteArtiste(deleteTargetId);
    }
  });

  // Image preview on input change
  $('#inputImage').on('input', function() {
    var url = $(this).val().trim();
    if (url) {
      $('#previewImg').attr('src', url);
      $('#imagePreview').addClass('has-image');
    } else {
      $('#previewImg').removeAttr('src');
      $('#imagePreview').removeClass('has-image');
    }
  });

  // Search input (debounced)
  var searchTimeout;
  $('#searchInput').on('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
  });

  // Filter & Sort change
  $('#filterGenre, #sortBy').on('change', applyFilters);


  // Initialize

  $(document).ready(function() {
    fetchArtistes();
  });

})(jQuery);

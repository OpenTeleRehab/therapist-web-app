import React from 'react';
import { Style } from 'react-style-tag';

const ColorScheme = (color) => {
  return (
    <Style>
      {`
            .bg-primary {
              background-color: ${color.primary_color} !important;
            }
            .navbar-nav .nav-link.active {
              background-color: ${color.secondary_color} !important;
              &:hover {
                color: #ffffff !important;
              }
            }
            .navbar-dark .navbar-nav .nav-link:hover {
              color: ${color.secondary_color};
            }
            .btn-primary {
              background-color: ${color.primary_color} !important;
              border-color: ${color.primary_color} !important;
              &:hover {
                background-color: ${color.secondary_color} !important;
                border-color: ${color.secondary_color} !important;
              }
              &:focus {
                box-shadow: 0 0 0 0.2rem ${color.primary_color};
              }
            }
            .btn-link {
              color: ${color.primary_color};
              &:hover  {
                color: ${color.secondary_color} !important;
              }
              &:focus {
                box-shadow: 0 0 0 0.2rem ${color.primary_color};
              }
            }
            .btn-link :hover {
               color: ${color.secondary_color};
            }
            a {
              color: ${color.primary_color};
              &:hover {
                color: ${color.secondary_color};
              }
            }
            .page-item.active .page-link {
              background-color: ${color.primary_color};
              border-color: ${color.primary_color};
            }
            .page-item.disabled .page-link {
              background-color: #fff;
              border-color: #dee2e6;
            }
            .table .hover-primary:hover {
              background-color: ${color.secondary_color};
            }
            .exercise-pagination .active-paginate {
              background-color: ${color.primary_color};
              border-top-color: ${color.primary_color};
            }
            .text-primary {
              color: ${color.primary_text_color} !important;
            }
            .btn-outline-primary {
              border-color: ${color.primary_color} !important;
              color: ${color.primary_color} !important;
              &:hover {
                background-color: ${color.primary_color} !important;
                border-color: ${color.primary_color} !important;
                color: #ffffff !important;
              }
              &:focus {
                box-shadow: 0 0 0 0.2rem ${color.primary_color} !important;
              }
            }
            .page-link {
              color: ${color.primary_color};
              &:hover {
                color: ${color.secondary_color};
              }
            }
            .dashboard-top-card .card-number {
              color: ${color.primary_color};
            } 
            .fc-button-primary {
              background-color: ${color.primary_color} !important;
              border-color: ${color.primary_color} !important;
              &:hover {
                background-color: ${color.secondary_color} !important;
                border-color: ${color.secondary_color} !important;
              }
              &:focus {
                box-shadow: 0 0 0 0.2rem ${color.primary_color};
              }
            }
            .fc-h-event {
              background-color: ${color.primary_color};
              border-color: ${color.primary_color};
              &:hover {
                background-color: ${color.secondary_color};
                border-color: ${color.secondary_color};
              }
            }
            .badge-primary {
              background-color: ${color.primary_color};
            }
            .chat-message-bubble.right {
              background-color: ${color.primary_color};
            }
            .library-pagination .active-paginate {
              background-color: ${color.primary_color};
              border-color: ${color.primary_color};
            }
            .questionnaire-title .title {
              color: ${color.primary_color};
            }
            .custom-control-input {
              border-color: ${color.primary_color};
            }
            .custom-control-input:checked ~ 
            .custom-control-label::before {
              border-color: ${color.primary_color};
              background-color: ${color.primary_color};
            }
            .top-bar .custom-control-label:before {
              border-color: ${color.primary_color};
            }
      `}
    </Style>
  );
};

export default ColorScheme;

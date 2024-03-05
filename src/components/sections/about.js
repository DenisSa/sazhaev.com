import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';

const StyledAboutSection = styled.section`
  max-width: 1000px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
// const StyledPic = styled.div`
//   position: relative;
//   max-width: 300px;

//   @media (max-width: 768px) {
//     margin: 50px auto 0;
//     width: 70%;
//   }

//   .wrapper {
//     ${({ theme }) => theme.mixins.boxShadow};
//     display: block;
//     position: relative;
//     width: 100%;
//     border-radius: var(--border-radius);
//     background-color: var(--green);

//     &:hover,
//     &:focus {
//       outline: 0;
//       transform: translate(-4px, -4px);

//       &:after {
//         transform: translate(8px, 8px);
//       }

//       .img {
//         filter: none;
//         mix-blend-mode: normal;
//       }
//     }

//     .img {
//       position: relative;
//       border-radius: var(--border-radius);
//       mix-blend-mode: multiply;
//       filter: grayscale(100%) contrast(1);
//       transition: var(--transition);
//     }

//     &:before,
//     &:after {
//       content: '';
//       display: block;
//       position: absolute;
//       width: 100%;
//       height: 100%;
//       border-radius: var(--border-radius);
//       transition: var(--transition);
//     }

//     &:before {
//       top: 0;
//       left: 0;
//       background-color: var(--navy);
//       mix-blend-mode: screen;
//     }

//     &:after {
//       border: 2px solid var(--green);
//       top: 14px;
//       left: 14px;
//       z-index: -1;
//     }
//   }
// `;

const About = () => {
  const revealContainer = useRef(null);

  useEffect(() => {
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'TypeScript',
    'Python',
    'AWS CDK',
    'GitHub Actions',
    'Linux',
    'Node.js',
    'OpenAI',
    'Docker',
    'C#',
    'Serverless',
    'Microservices',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Throughout my career I've had the privilege of working on a wide range of projects,
              from small startups to large enterprises, from embedded systems to web applications,
              and from greenfield projects to legacy systems. This has given me a wide range of
              experience and knowledge that I can bring to any project.
            </p>
            <p>
              A fundamental aspect of my professional philisophy is that software development is a
              team sport. I believe that the best software is built by teams of talented, passionate
              individuals who are empowered to make decisions and take ownership of their work. I'm
              a strong advocate for agile methodologies, and I believe that a culture of
              collaboration, communication and continuous improvement is essential for building
              great software.
            </p>
            <p>
              I champion blameless post-mortems, recognizing them as invaluable opportunities for
              learning and growth, and I believe that a culture of learning, trust and transparency
              is essential for building high-performing teams. I'm also a strong advocate for
              test-driven development, and I believe that automated testing is essential for
              building robust, maintainable systems.
            </p>
            <p>
              I'm a firm believer in the power of automation, and I'm always looking for ways to
              make my life easier by writing code, as well as leveraging the power of cutting-edge
              tools and technologies to stay at the forefront of the ever-evolving landscape of
              software engineering.
            </p>

            <p>Here are a few technologies and languages I’ve been working with recently:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        {/* <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic> */}
      </div>
    </StyledAboutSection>
  );
};

export default About;

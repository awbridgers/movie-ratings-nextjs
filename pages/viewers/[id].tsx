import React from 'react';
import {IRating, IViewer} from '../../types';
import RatingTable from '../../components/ratingTable';
import {useMediaQuery} from 'react-responsive';
import {GetStaticPaths, GetStaticProps} from 'next';
import {getAllViewers} from '../../util/getAllViewers';
import Head from 'next/head';

interface IProps {
  ratings: IRating[];
  name: string;
  viewer: IViewer | undefined;
}

const ViewerPage = ({viewer}: IProps) => {
  const isMobile = useMediaQuery({maxWidth: 700});
  return (
    <>
    <Head>
      <title>{viewer ? viewer.name : 'Viewer'}</title>
      <meta name = 'description' content = {`Viewer information for ${viewer ? viewer.name : 'Viewer'}`}/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    </Head>
      <div>
        {viewer && (
          <RatingTable
            movie
            title={`${viewer.name}'s Ratings`}
            ratings={viewer.ratings}
            isMobile={isMobile}
          />
        )}
      </div>
    </>
  );
};

export default ViewerPage;

export const getStaticProps: GetStaticProps = async ({params}) => {
  const viewerId = params!.id as string;
  const viewers = await getAllViewers();
  const viewer = viewers.find((x) => x.id === viewerId);
  return {
    props: {
      viewer,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const viewers = await getAllViewers();
  const paths = viewers.map((x) => ({params: {id: x.id}}));
  return {
    paths,
    fallback: false,
  };
};
